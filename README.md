# HelloSalesforce

Playing with Salesforce. That's SF too.

## Contents

- [docs](./docs/) — GitHub Actions によって自動生成されたファイル（Salesforce Tooling API の取得結果など）
- [scripts](./scripts/) — データ取得などに使用するスクリプト群

## Known Errors

### `REQUEST_LIMIT_EXCEEDED`

Salesforce API には1日あたりのリクエスト数に上限があります。上限を超えると以下のようなエラーが発生します。

```json
data: {
  message: 'TotalRequests Limit exceeded.',
  errorCode: 'REQUEST_LIMIT_EXCEEDED'
}
```

これは Salesforce 側の制限によるものであり、しばらく待つことで解消されます。API リクエスト数の上限は Salesforce org の種別やエディションによって異なりますが、通常は太平洋標準時（PST）の深夜0時（日本標準時（JST）の午後5時）にリセットされます。

詳細は [Salesforce の公式ドキュメント](https://developer.salesforce.com/docs/atlas.en-us.salesforce_app_limits_cheatsheet.meta/salesforce_app_limits_cheatsheet/salesforce_app_limits_platform_api.htm) を参照してください。
