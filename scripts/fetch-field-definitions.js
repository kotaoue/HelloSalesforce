import { AuthInfo, Connection } from '@salesforce/core';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, '..', 'docs');
const OUTPUT_FILE = resolve(DOCS_DIR, 'field-definitions.json');

const username = process.env.SF_USERNAME;
if (!username) {
  console.error('Error: SF_USERNAME environment variable is required.');
  process.exit(1);
}

async function fetchFieldDefinitions() {
  const authInfo = await AuthInfo.create({ username });
  const connection = await Connection.create({ authInfo });

  console.log(`Connected to: ${connection.instanceUrl}`);

  let records = [];
  let result = await connection.tooling.query(
    'SELECT Id, DurableId, QualifiedApiName, EntityDefinitionId, NamespacePrefix, DeveloperName, MasterLabel, Label, DataType, IsCalculated, IsNillable, IsUnique, IsIdLookup, IsIndexed, IsApiFilterable, IsApiGroupable, IsApiSortable FROM FieldDefinition'
  );
  records = records.concat(result.records);

  while (!result.done && result.nextRecordsUrl) {
    result = await connection.tooling.queryMore(result.nextRecordsUrl);
    records = records.concat(result.records);
  }

  console.log(`Fetched ${records.length} FieldDefinition records.`);

  const output = {
    fetchedAt: new Date().toISOString(),
    instanceUrl: connection.instanceUrl,
    totalSize: records.length,
    records,
  };

  await mkdir(DOCS_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Results saved to ${OUTPUT_FILE}`);
}

fetchFieldDefinitions().catch((err) => {
  console.error(err);
  process.exit(1);
});
