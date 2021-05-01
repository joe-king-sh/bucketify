
![bucketify-logo](../src/images/bucketify_logo.png)  

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

Bucketify(https://www.bucketify.net/) クラウド時代のWebミュージックプレイヤーです.
あなたがAmazon S3に保存している気に入りの音楽を、いつ、どこからでも再生できます.

![bucketify-demo](../src/images/bucketify_demo_pc.gif)  


## 機能
- ストリーミング再生
  - S3バケットに保管した音楽ファイルをストリーミング再生できます. 
  - スマートフォンでバックグラウンド再生にも対応しています.
- 自動生成されるライブラリ
  - トラック別、アーティスト別(🚧)、アルバム別(🚧)でライブラリを自動生成します.
  - 対応している音声ファイルの拡張子は'mp3'、'm4a'です.
- クラウドに保存されるプレイリスト(🚧)
  - お気に入りのプレイリストをクラウドに保存することができます. 保存したプレイリストは、いつでも、どこでも、どのデバイスからでも再生可能です.

## 利用に必要なもの
- あなたのAWSアカウント
- オーディオファイルを格納するあなたのS3バケット
- バケットにアクセスできるポリシーを持った、IAM User

## アーキテクチャ
- Bucketifyはあなたのオーディオファイルの**メタデータのみ**を管理します.
![bucketify-how-it-work](../src/images/architecture-ja.drawio.svg)  

## License
このプロジェクトは MIT Licenseです.