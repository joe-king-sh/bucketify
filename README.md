# bucketify
Music player web application to play music stored in  AWS S3 bucket.


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



TODO
- [x] GenericTemplateを分解
- [ ] AuthStateをどこまで持たせるか、GenerateTmeplateに絶対渡さないといけないけどLandingはLogin不要にしたい。だけどLoginできてる時はAppBarとかを変更したい。Stateの流れを図示して考える。
- 上記が無理そうなら、Landingだけ別ページとして管理、ヘッダーとかも付けない。もしくは付けても胃から、ログイン状態に応じて変更したりしない。そうする場合トップのロゴ押したときの遷移先を変更する必要あり

- [x] stateのまとめ資料作成 
- [ ] SingUpページの直接表示方法の確認

Known error
 - [] コントラストをDrawerから遷移した際にTopに飛ばされる
 - 