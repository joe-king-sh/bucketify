# Bucketify

![bucketify-logo](bucketify/build/static/media/bucketify_logo.43f80d6b.png)  
Music player web application to play music stored in  AWS S3 bucket.  
BucketifyはAmazon S3に格納したオーディオファイルを再生するクラウド時代のミュージックプレーヤーです。  

## 機能
- ストリーミング再生
  - SSのファイルをストリーミングで再生可能です。
  - モバイルでのバックグラウンド再生も対応しています。
- ライブラリ自動作成
  - SSのmp3、mp4ファイルをスキャンしライブラリを自動作成します
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

