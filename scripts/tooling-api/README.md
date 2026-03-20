# scripts/tooling-api

このディレクトリには Salesforce Tooling API を利用してメタデータを取得するスクリプトが含まれます。

## ファイル一覧

| ファイル | 説明 |
| --- | --- |
| `fetch-field-definitions.js` | `FieldDefinition` を取得し、指定フォーマットで出力するエントリーポイント |
| `fetch-objects.js` | `EntityDefinition`（オブジェクト一覧）を取得して JSON 出力するエントリーポイント |
| `fetch.js` | Tooling API 認証・SOQL 実行・ページングを行う取得処理 |
| `output.js` | JSON / CSV への保存、およびオブジェクト単位出力処理 |

## 前提条件

- Node.js 18 以上
- Salesforce CLI (`sf`) が利用できること
- `SF_USERNAME` 環境変数が設定されていること

## 環境変数

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `SF_USERNAME` | 必須 | 接続対象の Salesforce ユーザー名 |
| `OUTPUT_DIR` | 任意 | 出力先ディレクトリ。未指定時は `docs/` |

## 実行コマンド

リポジトリルートで実行します。

```bash
npm ci
```

```bash
# 全件を JSON で出力
npm run fetch-field-definitions:json

# 全件を CSV で出力
npm run fetch-field-definitions:csv

# オブジェクト単位で JSON 出力（docs/objects/*.json）
npm run fetch-field-definitions:json-per-object

# オブジェクト単位で CSV 出力（docs/objects/*.csv）
npm run fetch-field-definitions:csv-per-object

# オブジェクト一覧を JSON 出力（docs/objects.json）
npm run fetch-objects:json
```

## 出力先

- `docs/field-definitions.json`
- `docs/field-definitions.csv`
- `docs/objects/*.json`
- `docs/objects/*.csv`
- `docs/objects.json`

ワークフロー運用については [`.github/workflows/README.md`](../../.github/workflows/README.md) を参照してください。
