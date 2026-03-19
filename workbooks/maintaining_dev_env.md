# 開発環境を効率的に維持する方法

## やりたいこと

Salesforceを利用する他チーム向けに、他チームが自由にできる開発環境を簡単/安全/低コストで提供/維持したい

## 課題感

RDSをDBを共有するときのように

1. 本番DBのスナップショットを定期取得
1. 定期取得したスナップショットを定期的にDEV/STGに配布
1. スナップショットを配布する仕組みがあるので、QA用などで個別環のDBが必要になったら簡単に作成

みたいにできるとベストだが…
Salesfofceの開発用環境はシステム情報な制約で維持することが難しいと理解している。
具体的には

1. DEV/STGとして払い出せるDB数に制約がある
1. DEV/STG環境のデータ容量に上限がある
1. データ容量に上限があるのでPRODの完全なスナップショットをDEV/STGにリフレッシュして反映することが難しい
1. データリフレッシュすると認証情報が変更されるので、外部接続しているシステムの認証情報の書き換えが必要

等

## 課題感の中に含まれていた事実誤認

### 調査報告 (by Claude)

上記の課題感について調査した結果、以下の点について事実誤認または補足が必要な情報が見つかりました。

#### 1. DEV/STG環境のデータ容量に上限がある（課題感2）

**判定: 部分的に誤認あり**
確かに、以下のSandboxタイプには容量制限があります:

- Developer Sandbox: 200MB
- Developer Pro Sandbox: 1GB
- Partial Copy Sandbox: 5GB

しかし、**Full Sandboxは本番環境と同じストレージ容量を持ちます**。つまり、Full Sandboxを使用すれば容量制限の問題は解決できます。

**参考情報:**

- [Sandbox Licenses and Storage Limits by Type - Salesforce Help](https://help.salesforce.com/s/articleView?id=platform.data_sandbox_environments.htm&language=en_US&type=5)
- [What Is a Salesforce Sandbox? - Salesforce Ben](https://www.salesforceben.com/salesforce-sandbox/)

#### 2. PRODの完全なスナップショットをDEV/STGにリフレッシュして反映することが難しい（課題感3）

**判定: 誤認あり**
Full Sandboxを使用すれば、本番環境の完全なコピー（スナップショット）を作成できます。

制約となるのは容量ではなく、**リフレッシュ間隔が29日**という点です。つまり、Full Sandboxは一度作成またはリフレッシュすると、次のリフレッシュまで29日間待つ必要があります。

**参考情報:**

- [Sandboxes: Staging Environments for Customizing and Testing - Salesforce PDF](https://resources.docs.salesforce.com/latest/latest/en-us/sfdc/pdf/deploy_sandboxes.pdf)
- [What is a Salesforce Sandbox? Types Explained - Flosum](https://www.flosum.com/blog/salesforce-sandbox-types)

#### 3. データリフレッシュすると認証情報が変更される（課題感4）

**判定: 事実だが、これは意図的なセキュリティ仕様**
Sandboxリフレッシュ後に外部システムの認証情報の再設定が必要になるのは事実です。しかし、これは制約や不具合ではなく、**セキュリティ上の意図的な設計仕様**です。

具体的には:

- Sandboxリフレッシュにより新しいOrg IDが生成される
- 既存のOAuthトークンやNamed Credentialsが無効化される
- これにより、Sandbox環境が誤って本番システムに自動接続することを防ぐ

つまり、認証情報のリセットは、本番データの漏洩や意図しない本番システムへのアクセスを防ぐためのセキュリティ対策です。

**参考情報:**

- [Salesforce Sandbox Refresh: A Complete Guide - Xappex](https://www.xappex.com/blog/salesforce-sandbox-refresh/)
- [Authentication issues after sandbox refresh - Gearset](https://docs.gearset.com/en/articles/8703331-authentication-issues-after-a-sandbox-refresh)

#### 補足: Sandboxの払い出し数について（課題感1）

**判定: 正確**
Salesforceエディションによって利用可能なSandbox数には確かに制限があります。例:

- Enterprise Edition: 25 Developer + 1 Developer Pro + 1 Partial Copy
- Unlimited Edition: 100 Developer + 5 Developer Pro + 1 Partial Copy + 1 Full

ただし、追加のSandboxライセンスを購入することも可能です。

**参考情報:**

- [Sandbox License Compliance - Salesforce Help](https://help.salesforce.com/s/articleView?id=platform.data_sandbox_license_compliance.htm&language=en_US&type=5)

## 要検討事項

### コスト

#### Salesforceライセンス体系とSandbox割り当て (2026年)

| エディション | 価格 (user/month) | Developer Sandbox | Developer Pro | Partial Copy | Full Sandbox |
| ---------- | ---------------- | ----------------- | ------------- | ------------ | ------------ |
| Starter Suite | $25 | - | - | - | - |
| Pro Suite | $100 | 10 | - | - | - |
| Enterprise | $175 | 25 | 1 | 1 | - |
| Unlimited | $350 | 100 | 5 | 1 | **1** |
| Agentforce 1 | $550 | 100+ | 5+ | 1+ | **1+** |

#### Sandbox追加購入コスト

Full Sandboxや追加のSandboxが必要な場合、以下のコストで追加購入可能です:

| Sandboxタイプ | 価格計算方法 | 推定年間コスト |
| ------------ | ---------- | ------------- |
| Developer Sandbox | 無料 | $0 |
| Developer Pro | Net Spendの5% | - |
| Partial Copy | Net Spendの20% | - |
| **Full Sandbox** | **Net Spendの30%** | **$3,000 - $6,000+/年** |

**注:** Net Spendとは、組織の正味ライセンスコストを指します。Full Sandboxの最低コストは約$1,485/年（無料ライセンスを$495として計算した場合）。

#### Sandbox追加購入時のバンドル特典

Sandbox追加購入時は、以下のバンドル特典が付属します:

| 購入するSandbox | バンドル内容 |
| -------------- | ---------- |
| Developer Pro 1個 | + Developer Sandbox 5個 |
| Partial Copy 1個 | + Developer Sandbox 10個 |
| **Full Sandbox 1個** | **+ Developer Sandbox 15個** |

#### コスト試算例

例: Enterprise Edition (10ユーザー) でFull Sandboxを追加する場合

- 基本ライセンス: $175 × 10 = **$1,750/月** ($21,000/年)
- Full Sandbox追加: Net Spendの30% = 約**$6,300/年**
- バンドル特典: Developer Sandbox 15個が追加で利用可能
- **合計概算: $27,300/年**

**参考情報:**

- [Platform Sandboxes Pricing - Salesforce](https://www.salesforce.com/platform/sandboxes-environments/pricing/)
- [Salesforce License Types 2026 - Codleo](https://www.codleo.com/blog/salesforce-license-types)
- [Salesforce Pricing 2026 - SaaS CRM Review](https://saascrmreview.com/salesforce-pricing/)
- [Salesforce Sandboxes 101 - Arrify](https://arrify.com/salesforce-sandbox)

## 解決策

### 3つの解決策パターン比較

| 項目 | パターン1: Full Sandbox活用 | パターン2: 既存Sandbox活用 | パターン3: Partial Copy活用 |
| --- | --- | --- | --- |
| **コスト** | 高（年間約$6,300追加） | なし（既存ライセンス内） | $0〜中程度（追加購入時約$4,200/年） |
| **工数** | 低 | 高 | 中 |
| **運用難易度** | 低 | 高 | 中 |
| **リフレッシュ間隔** | 29日 | 手動（任意） | 5日 |
| **データ容量** | 本番と同じ | 200MB〜1GB | 5GB |
| **推奨ケース** | 本番同等の環境が必須 | 予算制約が厳しい | バランス重視 |

### パターン1: Full Sandbox活用（コスト増加パターン）

#### 概要

Full Sandboxを追加購入し、本番環境の完全なコピーを開発環境として利用する。29日間隔でのリフレッシュにより、定期的に最新の本番データを反映できる。

#### 詳細

**メリット:**

- 本番環境と同じストレージ容量で完全なデータコピーが可能
- バンドル特典でDeveloper Sandbox 15個が追加で利用可能
- リフレッシュは自動化されており、手動作業は認証情報の再設定のみ
- データの整合性が保たれやすい

**デメリット:**

- 年間約$6,300のコスト増加（Enterprise Edition 10ユーザーの場合）
- リフレッシュ間隔が29日と長い
- リフレッシュ後の認証情報再設定が必要

**コスト詳細:**

- Full Sandbox追加: Net Spendの30% ≒ $6,300/年
- バンドル特典: Developer Sandbox 15個

**推奨するケース:**

- 本番環境と同等のデータ・構成でテストする必要がある
- パフォーマンステストやUATで本番規模のデータが必要
- 予算に余裕がある

### パターン2: 既存Sandbox活用（コスト増加なしパターン）

#### 概要

既存のDeveloper/Developer Pro/Partial Copy Sandboxを活用し、開発に必要なデータを選択的にコピー・管理する。手動でのデータ移行・更新を行う。

#### 詳細

**メリット:**

- 追加コストなし（既存ライセンス内で対応）
- 必要なデータのみを選択できるため、データサイズを最小化できる
- リフレッシュタイミングを自由に調整可能

**デメリット:**

- データ選定、エクスポート/インポートの手動作業が発生
- スクリプト作成やツール設定の初期工数が高い
- データ整合性の管理が複雑
- 定期更新の運用負荷が高い

**必要なツール・手法:**

- Salesforce Data Loader
- Salesforce CLI (`sf data export/import`)
- Salesforce APIs (Bulk API, REST API)
- 自動化スクリプト（Python, Node.js等）

**推奨するケース:**

- 予算制約が厳しく、追加コストを避けたい
- 開発に必要なデータセットが明確で小規模
- 技術チームにデータ管理のスキルがある

### パターン3: Partial Copy Sandbox活用（折衷案）

#### 概要

Partial Copy Sandbox（5GB）を活用し、開発に必要な最小限のデータセットを定義してコピーする。Sandbox Templateを使用することで、5日間隔でのリフレッシュが可能。

#### 詳細

**メリット:**

- Enterprise Editionには1個含まれているため、追加コスト不要
- Sandbox Templateでデータ選定を管理できる
- リフレッシュ間隔が5日と短い
- Full Sandboxよりも低コストで拡張可能

**デメリット:**

- データ容量が5GBに制限される
- 初期のTemplate設定に工数が必要
- 本番環境の全データは含められない
- 追加購入する場合は年間約$4,200のコスト

**実装手順:**

1. Sandbox Templateを作成し、コピーするオブジェクトとレコード条件を定義
2. Partial Copy Sandboxを作成またはリフレッシュ
3. 5日間隔でリフレッシュ可能
4. 必要に応じて追加のPartial Copy Sandboxを購入

**コスト詳細:**

- Enterprise Editionに含まれる1個: $0
- 追加購入時: Net Spendの20% ≒ $4,200/年
- バンドル特典: Developer Sandbox 10個

**推奨するケース:**

- 開発に必要なデータセットが5GB以内に収まる
- リフレッシュ頻度を高めたい（5日間隔）
- コストと機能性のバランスを重視
- 段階的にデータ管理を改善したい

### 推奨アプローチ

組織の状況に応じて、以下のように選択することを推奨します:

1. **まずはパターン3（Partial Copy）で開始**: 既存ライセンス内で5日間隔のリフレッシュを実現
2. **データセットの見直し**: Template設定で本当に必要なデータを精査
3. **必要に応じてパターン1（Full Sandbox）へ移行**: 本番同等の環境が必須になった段階で検討

**参考情報:**

- [Sandbox Templates - Salesforce Help](https://help.salesforce.com/s/articleView?id=sf.data_sandbox_create.htm&type=5)
- [Data Loader - Salesforce](https://developer.salesforce.com/tools/data-loader)
- [Salesforce CLI Data Commands](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_data.htm)
