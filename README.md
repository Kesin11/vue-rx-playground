# vue-rx-playground

> Rx.js + Vue.js playground

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

# 仕様
- [x] ユーザーがリスト構造で並んでる
- [x] いいねボタンがある
- [x] いいねボタンを押すとカウントアップする
- [x] ダブルクリックすると超いいねがカウントアップされる
- [x] ユーザー追加を押すとユーザーが追加される
- [x] ユーザー追加には時間がかかり、その間追加中の文言がでる
- [x] キャンセルを押せばユーザー追加をキャンセルできる
- [ ] Storeへの分離
  - [ ] Immutable.js検討してみる？
- [ ] ユーザーの情報が更新されたときサーバーに保存する
  - [ ] Domain, Infrastructureの分離
  - [ ] 保存に成功したらメッセージを出す
  - [ ] ローカル状態のリセットができる
  - [ ] ローカル状態をサーバーに保存する
  - [ ] いいねのボタンを押し終わって一定時間経つと自動保存

# 設計
MVVM + Layerd Architecture

## View
DOM定義とイベントの発火

- Vueコンポーネント

## ViewModel
DOM操作のための状態管理と、イベントハンドリング
Storeを監視して更新があったときにはgetState()でプレーンなjsオブジェクトを生成してもらってdataを更新する

- Vueコンポーネントのdata
- Vueコンポーネントのmethods

## Application
ユースケースを実現するところであり、ViewModelとやりとりをする窓口でもある。

StoreはDomainのオブジェクトを持ち、Domainオブジェクトが更新されたことをViewModelに伝える。

- UseCase
- Store

### Usecase(action)
複数のStoreの協調動作が唯一許されるクラスであり、
外部APIとの通信もInfra層を通じてUsecaseのみが行うことができる。

複雑化しやすいAjaxが行われる箇所を１つにまとめることで見通しを良くする

### Store
Domainの集約と、Domainが変更されたことをViewに通知する。
アプリ全体のstate = Storeが持つModelから生成されるプレーンなjsオブジェクト
という構造になる。
ViewModelのdataの1つのキーと1対1で対応するStoreができるはず

## Domain
いわゆるドメインモデル。あるオブジェクトに関する振る舞いや状態の更新を担当する。
必要ならInfra層のオブジェクトも持つ。

- Model

## Infrastructure
ブラウザなどの環境依存だったり、外部に依存するもの。
ModelがInfraに依存しないように、InfraがModelを持つという依存関係にする。

- DBとの通信
- 外部APIとの通信

# ディレクトリ構造メモ

Component/
  App.vue
Usecase/
  User.js
Store/
  Users.js
  Notifications.js
Model/
  User.js
  Notification.js
Infra/
  ApiClient.js
