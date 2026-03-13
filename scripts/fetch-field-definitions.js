import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchFieldDefinitions } from './lib/fetch.js';
import { saveResults, saveResultsAsCsv } from './lib/output.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const format = process.argv[2];
if (format !== 'json' && format !== 'csv') {
  console.error('Error: format argument is missing or invalid. Use "json" or "csv".');
  process.exit(1);
}

const OUTPUT_PATH = resolve(
  __dirname,
  '..',
  'docs',
  `field-definitions.${format}`
);

const username = process.env.SF_USERNAME;
if (!username) {
  console.error('Error: SF_USERNAME environment variable is required.');
  process.exit(1);
}

const data = await fetchFieldDefinitions(username).catch((err) => {
  console.error(err);
  process.exit(1);
});

switch (format) {
  case 'json':
    await saveResults(data, OUTPUT_PATH).catch((err) => {
      console.error(err);
      process.exit(1);
    });
    break;
  case 'csv':
    await saveResultsAsCsv(data, OUTPUT_PATH).catch((err) => {
      console.error(err);
      process.exit(1);
    });
    break;
}
