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

## 解決策

WIP
