import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchObjects } from './fetch.js';
import { saveObjectResults } from './output.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const username = process.env.SF_USERNAME;
if (!username) {
  console.error('Error: SF_USERNAME environment variable is required.');
  process.exit(1);
}

const data = await fetchObjects(username).catch((err) => {
  console.error(err);
  process.exit(1);
});

const OUTPUT_DIR = process.env.OUTPUT_DIR
  ? resolve(process.env.OUTPUT_DIR)
  : resolve(__dirname, '..', '..', 'docs');

const OUTPUT_PATH = resolve(OUTPUT_DIR, 'objects.json');

await saveObjectResults(data, OUTPUT_PATH).catch((err) => {
  console.error(err);
  process.exit(1);
});
