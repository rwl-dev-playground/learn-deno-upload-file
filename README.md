# Deno Upload file

## 本リポジトリの目的
Deno Deploy上で安価に画像サーバーを構築したい  

## 本リポジトリの達成目標
- [ ] ~~Deta Driveで画像取得ができるようにする~~  
- [x] Deta Drive単体で実装が不可能なため、Deno KVで実装できないか試す
- [ ] Google Cloud Storageで画像取得が出来るようにする

### 結論
Deno KVは1回に65.5KBのアップロードしかできず、kv_toolboxというライブラリを使ってもcommitの10回上限に引っかかり655KBまでしかアップロードできない
画像として655KB以上の画像がサーバー上に載る可能性は充分あるため、採用は難しい
また、今回の確認対象だったDeta DriveやCloudflare R2も対象のサーバーに実装をあげる必要がある

~~よって、現状Deno Deploy上から安価に画像サーバーを構築することは難しい~~  
Google Cloud Storageを利用すれば、比較的安価にDeno Deploy上で画像サーバーを作成できる可能性がある

## 参考資料
- [Hono - Ultrafast web framework for the Edges](https://hono.dev/)
- [HTTP API - Space Docs](https://deta.space/docs/en/reference/drive/HTTP)
- [mikBighne98/deno-on-deta-space: Deno apps for testing on Deta Space](https://github.com/mikBighne98/deno-on-deta-space)
- [KV | Manual | Deno](https://deno.com/manual@v1.34.0/runtime/kv)
- [kv_toolbox@0.0.2 | Deno](https://deno.land/x/kv_toolbox@0.0.2)
- [Cloud Storage とは | Google Cloud](https://cloud.google.com/storage/docs/introduction?hl=ja)
- [Google Cloud Storage JSON API の概要](https://cloud.google.com/storage/docs/json_api?hl=ja)
- [Cloud Storage の認証 | Google Cloud](https://cloud.google.com/storage/docs/authentication?hl=ja)
