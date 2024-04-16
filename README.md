# SkyWay Conference

[SkyWay](https://skyway.ntt.com/)を利用した[Web会議アプリケーション「SkyWay Conference」](https://conf.demo.skyway.ntt.com/)のソースコードです。 [![License][license-image]][license-url]

<p align="center"><img width="80%" alt="A ScreenShot of SkyWay Conference" src="https://github.com/skyway/example-conference-webapp/assets/85332716/0b4a25ee-9c41-4a3a-806e-03e8ac58e5f0"></p>

## 前提条件

SkyWay Conferenceをご自身の環境で利用するためには、まずSkyWayに登録し、アプリケーションを作成する必要があります。SkyWayのアカウントをまだ持っていない場合は、以下のサイトから登録してください。

https://console.skyway.ntt.com/signup/

登録アカウントでログインした後、アプリケーションを作成し、アプリケーションIDとシークレットキーを取得してください。

[アプリケーションIDとシークレットキーの取得について、詳しくはこちら](https://skyway.ntt.com/ja/docs/user-guide/javascript-sdk/quickstart/#164)を参照してください。

## ビルド方法

### 1. ソースコードのダウンロード

- `git clone`コマンドを使用してソースコードをダウンロードする場合は、次のコマンドを実行します。

  - ```shell
    $ git clone https://github.com/skyway/example-conference-webapp.git
    ```

- ZIP形式でソースコードをダウンロードする場合は、以下のURLからダウンロードします。

  - [https://github.com/skyway/example-conference-webapp/archive/master.zip](https://github.com/skyway/example-conference-webapp/archive/master.zip)

### 2. SkyWay Auth Tokenを発行するサーバーの準備と設定

SkyWayは、ユーザーが認証していないエンドユーザーによるSkyWayの不正利用を防ぐため、トークンベースの認証・認可機能を提供しています。 ユーザーは、自身が認証したエンドユーザーに対して適切な権限を付与したトークン（SkyWay Auth Token）を発行することで、エンドユーザーによるSkyWayの不正な利用を防ぐことができます。

アプリケーションIDはSkyWay Auth Tokenのペイロード部に含め、改ざんを防ぐためにシークレットキーで署名し発行してください。
[アプリケーションIDとシークレットキー、SkyWay Auth Tokenについて、詳しくはユーザーガイドの認証・認可](https://skyway.ntt.com/ja/docs/user-guide/authentication/)を参照してください。

このWebアプリケーションでは、SkyWay Auth Tokenを発行するサーバーへのPOSTリクエストに対して、レスポンスbodyが以下のJSON形式でSkyWay Auth Tokenが発行される場合の実装です。
```json
{
  "authToken": "eyJhb..."
}
```

`.env`ファイルに、サーバーのアドレスを設定してください。
以下に`.env`ファイルの例を示します。

```dotenv:.env
AUTH_TOKEN_SERVER=https://example.com/auth-token/
```

サーバーは例として、[https://github.com/skyway/authentication-samples](https://github.com/skyway/authentication-samples)を参考にしてください。

リクエスト方法やレスポンス形式が異なる場合は、[`src/conference/utils/skyway-auth-token.ts`](https://github.com/skyway/example-conference-webapp/blob/main/src/conference/utils/skyway-auth-token.ts)を修正してください。

https://github.com/skyway/authentication-samples のサーバーアプリケーションをlocalhostで`npm start`した時の`.env`は以下のようになります。

```dotenv:.env
AUTH_TOKEN_SERVER=http://localhost:8080/authenticate
```

### 3. ローカル環境での確認

以下のコマンドを実行してください。

```shell
$ npm ci
$ npm run dev
```

ブラウザで次のURLにアクセスして、動作を確認できます。

[http://localhost:9000/](http://localhost:9000/)

### 4. プロダクション環境へのデプロイ

以下のコマンドで、プロダクション環境用にビルドします。

```shell
$ npm run build
```

`dist`フォルダ内に、ビルドによって生成されたファイルが保存されます。以下のファイルをご自身が管理しているサーバーにアップロードしてください。

```
index.html
index.bundle.js
conference.html
conference.bundle.js
vendor.bundle.js
images/
```

注： SkyWay Conferenceで利用している`SkyWayStreamFactory`や`navigator.mediaDevices.getUserMedia`は、localhost以外のサイトでは、TLS/SSLにより保護されたサイトでしか利用できません。そのため、TLS/SSLにより保護されたサイトでお使い下さい。

注： 公開サーバーにアップロードすると誰でも利用可能な状態になりますので、アクセス制限/認証して下さい。

## カスタマイズの参考情報

このWebアプリケーションは、ReactとMobXを使用してUI構築と状態管理し、Emotionでスタイル設定しています。

以下は、ソースコードのディレクトリ構造についての詳細です。

| Path | 説明 |
| --- | --- |
| `public/`           | 静的ファイルとHTMLエントリーポイントを格納しています。 |
| `src/index/`        | 参加する会議の情報を入力する画面のコードを格納しています。 |
| `src/conference/`   | 会議画面のコードを格納しています。 |
| `src/shared/`       | 両画面で共有する処理とスタイル設定のコードを格納しています。 |
| `src/*/main.tsx`    | 各画面のエントリーポイントとなるTypeScriptファイルです。 |
| `src/*/app.tsx`     | 各画面のメインアプリケーションコンポーネントを定義しているTypeScriptファイルです。 |
| `src/*/contexts.ts` | Reactのコンテキストを定義しているTypeScriptファイルです。 |
| `src/*/stores/`     | アプリケーションの状態を管理するStoreを格納しているディレクトリです。 |
| `src/*/observers/`  | MobXのObserverでリアクティブにしたコンポーネントを格納しているディレクトリです。 |
| `src/*/components/` | Reactコンポーネントを格納しているディレクトリです。 |
| `src/*/effects/`    | アプリケーションの状態を変更するActionを格納しているディレクトリです。 |
| `src/*/utils/`      | ユーティリティ関数を格納しているディレクトリです。 |

## 動作環境

SkyWay Conferenceは、以下のブラウザで動作します。
- Google Chrome（最新の安定版）
- Firefox（最新の安定版）
- Safari（最新の安定版）
- Microsoft Edge（Chromium版v79以上の最新の安定版）

Android Chrome、Mobile Safari(iOS,iPadOS)でも利用可能ですが、画面UIはモバイルデバイスに最適化されていないため使いにくい場合があります。Android Firefoxについてはデバイスの選択がうまく動作しない不具合があるためご利用はお控えください。

## サポート

このアプリケーションに関するビルド方法やWebサーバーへの設置、カスタマイズについてのテクニカルサポートは提供していません。ご了承ください。

## IssueやPull Requestの作成について

原則として、このリポジトリに対してのIssueやPull Requestには対応しません。不具合修正や機能追加を行いたい場合は、ご自身でリポジトリをForkして行ってください。

## License / Copyright

[MIT License](./LICENSE)  
Copyright (c) 2024- NTT Communications Corp.

ソフトウェアの一部に [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0) のソフトウェアが含まれています。

[license-url]: https://github.com/skyway/example-conference-webapp/blob/main/LICENSE
[license-image]: https://img.shields.io/github/license/skyway/example-conference-webapp