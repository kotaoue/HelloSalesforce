import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const CSV_FIELDS = [
  'Id',
  'DurableId',
  'QualifiedApiName',
  'EntityDefinitionId',
  'NamespacePrefix',
  'DeveloperName',
  'MasterLabel',
  'Label',
  'DataType',
  'IsCalculated',
  'IsNillable',
  'IsIndexed',
  'IsApiFilterable',
  'IsApiGroupable',
  'IsApiSortable',
];

/**
 * Escape a value for CSV output.
 * @param {*} value
 * @returns {string}
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serialize FieldDefinition results to a JSON file.
 * @param {{ instanceUrl: string, records: object[] }} data
 * @param {string} outputFile - Absolute path to the destination file
 */
export async function saveResults(data, outputFile) {
  const output = {
    fetchedAt: new Date().toISOString(),
    instanceUrl: data.instanceUrl,
    totalSize: data.records.length,
    records: data.records,
  };

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Results saved to ${outputFile}`);
}

/**
 * Serialize FieldDefinition results to a CSV file.
 * @param {{ instanceUrl: string, records: object[] }} data
 * @param {string} outputFile - Absolute path to the destination file
 */
export async function saveResultsAsCsv(data, outputFile) {
  const header = CSV_FIELDS.join(',');
  const rows = data.records.map((record) =>
    CSV_FIELDS.map((field) => escapeCsvValue(record[field])).join(',')
  );
  const csv = [header, ...rows].join('\r\n') + '\r\n';

  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, csv, 'utf-8');
  console.log(`Results saved to ${outputFile}`);
}
