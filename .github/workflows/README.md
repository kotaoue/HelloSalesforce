# .github/workflows

## Actions 共通

### 事前準備

ワークフロー実行には以下の Repository Secrets が必要です。

| Secret 名 | 値 |
| --- | --- |
| `SFDX_AUTH_URL` | `sf org display --verbose --target-org <alias>` の `Sfdx Auth Url` |
| `SF_USERNAME` | 同コマンドの `Username` |

#### Secrets 取得手順

1. Salesforce CLI をインストール

    ```bash
    npm install -g @salesforce/cli
    ```

1. 対象 org にログイン

    ```bash
    # 例: instance-url を省略する場合（Developer Edition 等）
    sf org login web --alias myorg

    # または login.salesforce.com を明示
    sf org login web --instance-url https://login.salesforce.com --alias myorg
    ```

1. `SFDX_AUTH_URL` と `SF_USERNAME` を確認

    ```bash
    sf org display --verbose --target-org myorg
    ```

1. GitHub の Settings -> Secrets and variables -> Actions から登録

## fetch-field-definitions 固有

- [kotaoue/salesforce-field-inspector](https://github.com/kotaoue/salesforce-field-inspector)
