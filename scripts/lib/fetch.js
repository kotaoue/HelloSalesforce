import { AuthInfo, Connection } from '@salesforce/core';

const ENTITY_ID_PATTERN = /^[A-Za-z0-9_]+$/;
const BATCH_SIZE = 10;
const PAGE_SIZE = 2000;
// Salesforce SOQL OFFSET is capped at 2000 for FieldDefinition.
// With PAGE_SIZE=2000 and MAX_OFFSET=2000 we can retrieve up to 4000 records per
// batch, which is sufficient when BATCH_SIZE is kept small (≤10 entities).
const MAX_OFFSET = 2000;

/**
 * Validate a DurableId to prevent SOQL injection.
 * @param {string} id
 * @returns {boolean}
 */
function isValidDurableId(id) {
  return typeof id === 'string' && ENTITY_ID_PATTERN.test(id);
}

/**
 * Query all EntityDefinition DurableIds from the Tooling API.
 * @param {Connection} connection - Salesforce connection
 * @returns {string[]} - Array of DurableId values
 */
async function fetchEntityDefinitionIds(connection) {
  let ids = [];
  let result = await connection.tooling.query(
    'SELECT DurableId FROM EntityDefinition ORDER BY DurableId LIMIT 2000'
  );
  for (const record of result.records) {
    ids.push(record.DurableId);
  }

  while (!result.done && result.nextRecordsUrl) {
    result = await connection.tooling.queryMore(result.nextRecordsUrl);
    for (const record of result.records) {
      ids.push(record.DurableId);
    }
  }

  return ids;
}

/**
 * Query FieldDefinition records for a batch of EntityDefinition IDs.
 * FieldDefinition does not support queryMore(), so we paginate manually using
 * LIMIT + OFFSET.  The Salesforce SOQL OFFSET cap is 2000, which means up to
 * PAGE_SIZE + MAX_OFFSET (= 4000) records can be retrieved per batch.
 * Keeping BATCH_SIZE small (≤10) ensures this limit is rarely reached.
 * @param {Connection} connection - Salesforce connection
 * @param {string[]} entityIds - Array of validated EntityDefinition DurableId values
 * @returns {object[]} - Array of FieldDefinition records
 */
async function fetchFieldDefinitionBatch(connection, entityIds) {
  const inList = entityIds.map((id) => `'${id}'`).join(', ');
  let records = [];
  let offset = 0;

  while (true) {
    const soql =
      `SELECT Id, DurableId, QualifiedApiName, EntityDefinitionId, NamespacePrefix, DeveloperName, MasterLabel, Label, DataType, IsCalculated, IsNillable, IsIndexed, IsApiFilterable, IsApiGroupable, IsApiSortable` +
      ` FROM FieldDefinition WHERE EntityDefinitionId IN (${inList})` +
      ` ORDER BY EntityDefinitionId, DurableId LIMIT ${PAGE_SIZE} OFFSET ${offset}`;
    const result = await connection.tooling.query(soql);
    records = records.concat(result.records);

    if (result.records.length < PAGE_SIZE) {
      // Fewer records than the page size means there are no more pages.
      break;
    }

    if (offset >= MAX_OFFSET) {
      // SOQL OFFSET cannot exceed 2000.  Warn that results may be incomplete
      // and advise reducing BATCH_SIZE.
      console.warn(
        `Warning: reached the SOQL OFFSET limit (${MAX_OFFSET}) while fetching` +
          ` FieldDefinition records for a batch of ${entityIds.length} entity IDs` +
          ` (current BATCH_SIZE: ${entityIds.length}).` +
          ` Some records may have been omitted.  Reduce BATCH_SIZE to retrieve all records.`
      );
      break;
    }

    offset += PAGE_SIZE;
  }

  return records;
}

/**
 * Query all FieldDefinition records from the Tooling API.
 * @param {string} username - Salesforce username to authenticate as
 * @returns {{ instanceUrl: string, records: object[] }}
 */
export async function fetchFieldDefinitions(username) {
  const authInfo = await AuthInfo.create({ username });
  const connection = await Connection.create({ authInfo });

  console.log(`Connected to: ${connection.instanceUrl}`);

  const allEntityIds = await fetchEntityDefinitionIds(connection);
  const invalidEntityIds = allEntityIds.filter((id) => !isValidDurableId(id));
  if (invalidEntityIds.length > 0) {
    console.warn(`Skipping ${invalidEntityIds.length} EntityDefinition record(s) with invalid DurableId.`);
  }
  const validEntityIds = allEntityIds.filter(isValidDurableId);
  console.log(`Found ${validEntityIds.length} EntityDefinition records.`);

  let records = [];
  for (let i = 0; i < validEntityIds.length; i += BATCH_SIZE) {
    const batch = validEntityIds.slice(i, i + BATCH_SIZE);
    const batchRecords = await fetchFieldDefinitionBatch(connection, batch);
    records = records.concat(batchRecords);
  }

  console.log(`Fetched ${records.length} FieldDefinition records.`);

  return { instanceUrl: connection.instanceUrl, records };
}
