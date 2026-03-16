# scripts

This directory contains scripts for exploring and interacting with the Salesforce platform.

## Directory Structure

| Directory | Tech Stack | Description |
| --- | --- | --- |
| [`tooling-api/`](./tooling-api/) | Salesforce Tooling API | Scripts that use the [Tooling API](https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/intro_api_tooling.htm) to query metadata such as `FieldDefinition`, `ApexClass`, and `CustomObject`. |
| [`rest-api/`](./rest-api/) | Salesforce REST API | Scripts that use the [REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm) to perform CRUD operations on standard and custom Salesforce objects. |
| [`bulk-api/`](./bulk-api/) | Salesforce Bulk API | Scripts that use the [Bulk API v2](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/bulk_api_2_0.htm) to efficiently process large volumes of records asynchronously. |
| [`metadata-api/`](./metadata-api/) | Salesforce Metadata API | Scripts that use the [Metadata API](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_intro.htm) to retrieve and deploy org configuration such as custom fields, page layouts, and permission sets. |
| [`streaming-api/`](./streaming-api/) | Salesforce Streaming API | Scripts that subscribe to [Platform Events](https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm) and [PushTopic](https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/intro_stream.htm) channels to receive real-time data change notifications. |
| [`apex/`](./apex/) | Apex (Anonymous Execution) | Scripts that execute anonymous [Apex](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro_what_is_apex.htm) code via the Tooling API's `executeAnonymous` endpoint. |
| [`soql/`](./soql/) | SOQL | Scripts that run [SOQL (Salesforce Object Query Language)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) queries against Salesforce objects via the REST API. |

## Salesforce Tech Stack Overview

### Tooling API
The Tooling API provides access to Salesforce metadata and development tools. It is primarily used for building developer tooling — IDEs, code coverage analysis, metadata inspection. The existing [`fetch-field-definitions.js`](./fetch-field-definitions.js) script uses this API to retrieve `FieldDefinition` records.

### REST API
The core API for interacting with Salesforce data. It uses standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) and JSON payloads. Suitable for querying and manipulating records in any Salesforce object.

### Bulk API
Designed for loading or extracting large datasets (millions of records). Jobs are processed asynchronously, making it ideal for data migration, mass updates, and ETL pipelines.

### Metadata API
Used to move configuration — custom objects, fields, workflows, permission sets, etc. — between Salesforce environments. It is the backbone of CI/CD pipelines for Salesforce (Salesforce DX / SFDX).

### Streaming API / Platform Events
Enables publish-subscribe messaging on the Salesforce platform. Clients can subscribe to Platform Events, Change Data Capture (CDC) events, or PushTopic queries to receive low-latency notifications when data changes.

### Apex
Apex is a strongly-typed, Java-like language that runs on the Salesforce server. Anonymous Apex allows developers to execute arbitrary code snippets on-demand via the `/services/data/vXX.0/tooling/executeAnonymous` endpoint.

### SOQL
SOQL (Salesforce Object Query Language) is a SQL-like query language for Salesforce objects. It is used in REST API queries (`/services/data/vXX.0/query?q=SELECT+...`), Apex code, and developer tools to filter, sort, and aggregate records.
