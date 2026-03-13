import { AuthInfo, Connection } from '@salesforce/core';

const ENTITY_ID_PATTERN = /^[A-Za-z0-9_]+$/;
const BATCH_SIZE = 200;

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
    'SELECT DurableId FROM EntityDefinition ORDER BY DurableId'
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
 * @param {Connection} connection - Salesforce connection
 * @param {string[]} entityIds - Array of validated EntityDefinition DurableId values
 * @returns {object[]} - Array of FieldDefinition records
 */
async function fetchFieldDefinitionBatch(connection, entityIds) {
  const inList = entityIds.map((id) => `'${id}'`).join(', ');
  let records = [];
  let result = await connection.tooling.query(
    `SELECT Id, DurableId, QualifiedApiName, EntityDefinitionId, NamespacePrefix, DeveloperName, MasterLabel, Label, DataType, IsCalculated, IsNillable, IsIdLookup, IsIndexed, IsApiFilterable, IsApiGroupable, IsApiSortable FROM FieldDefinition WHERE EntityDefinitionId IN (${inList})`
  );
  records = records.concat(result.records);

  while (!result.done && result.nextRecordsUrl) {
    result = await connection.tooling.queryMore(result.nextRecordsUrl);
    records = records.concat(result.records);
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
