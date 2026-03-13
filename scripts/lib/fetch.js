import { AuthInfo, Connection } from '@salesforce/core';

/**
 * Query all FieldDefinition records from the Tooling API.
 * @param {string} username - Salesforce username to authenticate as
 * @returns {{ instanceUrl: string, records: object[] }}
 */
export async function fetchFieldDefinitions(username) {
  const authInfo = await AuthInfo.create({ username });
  const connection = await Connection.create({ authInfo });

  console.log(`Connected to: ${connection.instanceUrl}`);

  let records = [];
  let result = await connection.tooling.query(
    'SELECT Id, DurableId, QualifiedApiName, EntityDefinitionId, NamespacePrefix, DeveloperName, MasterLabel, Label, DataType, IsCalculated, IsNillable, IsIdLookup, IsIndexed, IsApiFilterable, IsApiGroupable, IsApiSortable FROM FieldDefinition'
  );
  records = records.concat(result.records);

  while (!result.done && result.nextRecordsUrl) {
    result = await connection.tooling.queryMore(result.nextRecordsUrl);
    records = records.concat(result.records);
  }

  console.log(`Fetched ${records.length} FieldDefinition records.`);

  return { instanceUrl: connection.instanceUrl, records };
}
