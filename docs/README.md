# docs

このディレクトリには GitHub Actions によって自動生成されたファイルが保存されます。

- `field-definitions.json` — Salesforce Tooling API の [FieldDefinition](https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/tooling_api_objects_fielddefinition.htm) オブジェクトを取得した結果

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

```
Sfdx Auth Url   force://PlatformCLI::5Aep861...@orgfarm-e70dfa8d5c-dev-ed.develop.lightning.force.com
```

### 4. SF_USERNAME を確認する

同じ `sf org display` 出力の `Username` 欄に表示されるユーザー名をコピーします。

```
Username        your.name@example.com
```

### 5. GitHub Repository Secrets に登録する

リポジトリの **Settings → Secrets and variables → Actions → New repository secret** から以下を登録します。

| Secret 名 | 値 |
|---|---|
| `SFDX_AUTH_URL` | 手順 3 で取得した `force://...` の文字列 |
| `SF_USERNAME` | 手順 4 で確認したユーザー名 |

### 6. ワークフローを手動実行する

**Actions タブ → "Fetch FieldDefinition" → "Run workflow"** ボタンをクリックします。

成功すると `docs/field-definitions.json` が自動コミットされます。  
以降は毎週日曜 3:23 UTC に自動実行されます。
