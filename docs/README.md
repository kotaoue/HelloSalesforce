# docs

このディレクトリには GitHub Actions によって自動生成されたファイルが保存されます。

## ファイル・ディレクトリ一覧

| パス | 説明 |
| --- | --- |
| `field-definitions.json` | Salesforce Tooling API の [FieldDefinition](https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/tooling_api_objects_fielddefinition.htm) オブジェクトを全件取得した結果（JSON 形式） |
| `field-definitions.csv` | 同上の結果（CSV 形式） |
| `objects/` | オブジェクトごとの FieldDefinition ファイル群。各ファイルは `<ObjectName>.json` または `<ObjectName>.csv` という命名規則で保存されます。 |
| `actions/` | [kotaoue/salesforce-field-inspector](https://github.com/kotaoue/salesforce-field-inspector) Action を使用して取得した、オブジェクトごとの FieldDefinition CSV ファイル群。 |

---

## セットアップ手順

ワークフローを動かすには、以下の 2 つの **Repository Secret** を設定する必要があります。

### 1. Salesforce CLI をローカルにインストール

```bash
npm install -g @salesforce/cli
```

### 2. 対象 org にログイン

```bash
# 例: instance-url を省略する場合（Developer Edition等の場合）
sf org login web --alias myorg

# または、login.salesforce.com を明示的に指定する場合
sf org login web --instance-url https://login.salesforce.com --alias myorg
```

ブラウザが開くので Salesforce の認証情報でログインしてください。

### 3. SFDX_AUTH_URL を取得する

```bash
sf org display --verbose --target-org myorg
```

出力の `Sfdx Auth Url` 欄に表示される値（`force://...` で始まる文字列）をコピーします。

```text
Sfdx Auth Url   force://PlatformCLI::5Aep861...@orgfarm-e70dfa8d5c-dev-ed.develop.lightning.force.com
```

### 4. SF_USERNAME を確認する

同じ `sf org display` 出力の `Username` 欄に表示されるユーザー名をコピーします。

```text
Username        your.name@example.com
```

### 5. GitHub Repository Secrets に登録する

リポジトリの **Settings → Secrets and variables → Actions → New repository secret** から以下を登録します。

| Secret 名 | 値 |
| --- | --- |
| `SFDX_AUTH_URL` | 手順 3 で取得した `force://...` の文字列 |
| `SF_USERNAME` | 手順 4 で確認したユーザー名 |

### 6. Fetch FieldDefinition (Actions CSV per object) で取得する

[kotaoue/salesforce-field-inspector](https://github.com/kotaoue/salesforce-field-inspector) Action を使用して FieldDefinition をオブジェクトごとの CSV ファイルとして取得します。

ワークフローファイル: [`.github/workflows/fetch-field-definitions-actions.yml`](../.github/workflows/fetch-field-definitions-actions.yml)

### 7. ワークフローを実行する

5 つの独立したワークフローが用意されています。

| ワークフロー名 | 更新対象 | 自動実行スケジュール |
| --- | --- | --- |
| **Fetch FieldDefinition (JSON)** | `docs/field-definitions.json` | 毎週日曜 3:23 UTC |
| **Fetch FieldDefinition (CSV)** | `docs/field-definitions.csv` | 毎週月曜 3:23 UTC |
| **Fetch FieldDefinition (JSON per object)** | `docs/objects/<ObjectName>.json` | 毎週火曜 3:23 UTC |
| **Fetch FieldDefinition (CSV per object)** | `docs/objects/<ObjectName>.csv` | 毎週水曜 3:23 UTC |
| **Fetch FieldDefinition (Actions CSV per object)** | `docs/actions/<ObjectName>.csv` | 毎週金曜 3:23 UTC |

各ワークフローは **Actions タブ → 対象ワークフロー名 → "Run workflow"** から手動実行することもできます。
