import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchFieldDefinitions } from './lib/fetch.js';
import { saveResults, saveResultsAsCsv } from './lib/output.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_JSON = resolve(__dirname, '..', 'docs', 'field-definitions.json');
const OUTPUT_CSV = resolve(__dirname, '..', 'docs', 'field-definitions.csv');

const username = process.env.SF_USERNAME;
if (!username) {
  console.error('Error: SF_USERNAME environment variable is required.');
  process.exit(1);
}

const data = await fetchFieldDefinitions(username).catch((err) => {
  console.error(err);
  process.exit(1);
});
await saveResults(data, OUTPUT_JSON).catch((err) => {
  console.error(err);
  process.exit(1);
});
await saveResultsAsCsv(data, OUTPUT_CSV).catch((err) => {
  console.error(err);
  process.exit(1);
});
