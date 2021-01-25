# Bucketify

![bucketify-logo](bucketify/build/static/media/bucketify_logo.43f80d6b.png)  
Music player web application to play music stored in  AWS S3 bucket.  
BucketifyはAmazon S3に格納したオーディオファイルを再生するクラウド時代のミュージックプレーヤーです。  

## 機能
- ストリーミング再生
  - S3のファイルをストリーミングで再生可能です。
  - モバイルでのバックグラウンド再生も対応しています。
- ライブラリ自動作成
  - SSのファイルをスキャンしライブラリを自動作成します(mp3,mp4a形式に対応)
- プレイリスト作成
  - あなたのお気に入りのプレイリストを作成できます
  - 作成したプレイリストはPCやモバイルからアクセス可能

## 利用にあたり準備いただくもの
- あなたのAWSアカウント
- オーディオを格納するSSバケット
- S3バケットへアクセス可能なアクセスキー/シークレットアクセスキー

## 個人情報の収集目的
- ユーザから収集した個人情報(メールアドレス、名前)については、本アプリケーションの運用管理以外に利用しません。

## 免責事項
- 本アプリケーションによって生じる不利益などについて、一切の責任を負いかねます。
- 個人で作成しているため、突然のサービス内容の変更や終了する可能性があります。

## Contact
- 

環境構築時のメモ
```
docker-compose build
docker-compose up

普段/zshなので
/bin/zshで.zshrcを読み込む
<!-- →Dockerやめる -->

npm install -g react && \ 

<!-- reduxやめる -->
<!-- npm install -g redux react-redux  -->


npm install aws-amplify @aws-amplify/ui-react

npm install --save @types/graphql
npm install --save type-graphql

yarn add aws-amplify-react

yarn add @material-ui/core


yarn add @material-ui/icons

yarn add react-router react-router-dom

yarn add @types/react-router-dom

最終的にはnpm installだけ

Docker内でtsのコンパイルが遅すぎるのでDockerやめる
```

## 機能
- Scan
  - 指定したバケットの対象曲をスキャンする
- プレイリスト自動作成
  - アーティスト別
  - アルバム別
  - マイプレイリスト
  - 全て再生
- 検索機能
- 

grahqlschemaの退避

```
type AudioMetaData
  @model
  @auth(rules: [{ allow: owner }]) {
  id: ID!
  dataType: String!
  dataValue1: String
  dataValue2: String
  owner: String!
}
```

```
type AudioMetaData
  @model
  @auth(rules: [{ allow: owner }])
  @key(fields: ["id","dataType"])
  @key(name: "dataValueIndex", fields: ["dataValue", "dataType"], queryField: "listAudioByDataValue")
  @key(name: "ownerIndex", fields: ["owner", "dataType"], queryField: "listAudioByOwner")
{
  id: ID!
  dataType: String!
  dataValue: String!
  owner: String!
}
```


Scanはクライアントサイドで行うことにする<-これ悩ましい。
クライアントサイドだと、一度全容量ローカルのDLしてくるのでかっこ悪い、けど進捗はわkる
サーバーサイドだと容量は気にしなくていんだけど、進捗がわからない、取れなかったこととかもわからない・・、あとLambdaだと１５分制限があるさら、添付のストレージが512MBしかない。
よってローカルでやるしかないねこれは。、、


容量を気にせずに、進捗もわかる形でスキャンができれば一番いいんだけど・・
あと、Labmdaのローカルのストレージの容量って・・？

https://www.npmjs.com/package/mp4js
と
https://github.com/creeperyang/id3-parser
を使って、
mp3とmp4をやる

SSから取得
メタデータ取得
ImageはS3にアップロード
Dynamodbに登録

ランディングはStepperStepperを使う
Stepper
https://material-ui.com/components/steppers/#stepper


## amplifyの構築
```
amplify init

amplify add auth
# Social loginの実装
マネジメントコンソールでIdPごとに属性のマッピングをする必要あり

amplify add api

# Social loginの実装
```