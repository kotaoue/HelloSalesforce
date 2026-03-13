import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

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
