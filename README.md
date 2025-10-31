# TransitExpense Lite

スマホから月ごとの交通費を申請して、Googleスプレッドシートに保存するミニアプリです。Next.js + TailwindCSS + TypeScript（GitHub Pages向けの静的出力対応）と、Google Apps Script（GAS）バックエンドのサンプルを含みます。

## 機能概要
- スマホ中心の入力フォーム（氏名・月・出発地・行き先・片道運賃・出勤日・備考）
- 自動計算：往復＝片道×2、合計＝往復×出勤回数、経路＝「出発地–行き先」
- 送信時スピナー、成功/エラートースト
- マスター（スタッフ一覧・出発地プリセット）はGASから取得（未設定時は内蔵の初期値）
- GitHub Pagesに静的サイトとしてデプロイ可能

## 起動方法（ローカル）
1. 依存関係をインストール
   - `npm install`
2. 環境変数を設定
   - `cp .env.local.example .env.local`
   - 必要に応じて `NEXT_PUBLIC_GAS_ENDPOINT` を `.env.local` に設定
3. 開発サーバー起動
   - `npm run dev`
4. ブラウザで `http://localhost:3000` を開く

## ビルドと静的出力
- `npm run export` で `out/` に静的ファイルを出力（GitHub Pagesに配置可能）
- `NEXT_PUBLIC_BASE_PATH` を設定すると、`/repo-name` のようなサブパス配下に対応します

## 環境変数
- `NEXT_PUBLIC_APP_TITLE`: アプリタイトル（任意、デフォルト: TransitExpense Lite）
- `NEXT_PUBLIC_GAS_ENDPOINT`: デプロイしたGAS Web AppのURL（クライアントから直接アクセス）。未設定時はマスターは内蔵初期値、送信はスタブ成功。
- `NEXT_PUBLIC_BASE_PATH`: GitHub Pages用のサブパス（例: `/repo-name`）。ローカルでは空でOK。

## Google Apps Script（GAS）
- スプレッドシート構成
  - `masters` シート: A列=スタッフ名, B列=出発地プリセット
  - `entries` シート: A=Timestamp, B=Month, C=Name, D=Origin, E=Destination, F=Route, G=OneWay, H=Roundtrip, I=Days CSV, J=Count, K=Total, L=Note
- `GAS/sample.gs` をApps Scriptエディタに貼り付け、Webアプリとしてデプロイ（「リンクを知っている全員」実行可、実行ユーザー: 自分）
- 発行されたWeb App URLを `NEXT_PUBLIC_GAS_ENDPOINT` に設定

注意: ブラウザからGAS Web Appへ直接GET/POSTします。CORSはGASのWeb App公開設定に依存します（一般公開のWeb Appであれば通常アクセス可能です）。

## GitHub Pages へのデプロイ
このプロジェクトは Next.js の静的出力（`output: 'export'`）を有効化済みで、`basePath/assetPrefix` はリポジトリ名に合わせて自動設定できます。

1. リポジトリをGitHubへPush（デフォルトブランチ: `main` or `master`）
2. リポジトリの Settings → Pages で「Build and deployment: GitHub Actions」を選択
3. 必要に応じて以下を設定
   - リポジトリ Variables もしくは Secrets に `NEXT_PUBLIC_GAS_ENDPOINT` を登録（GAS Web App URL）
4. PushするとActionsが `out/` をPagesにデプロイします

ワークフロー: `.github/workflows/deploy-pages.yml:1`

## 主要ファイル
- `pages/index.tsx:1` フォームUI
- `components/DayGrid.tsx:1` 出勤日（1〜31）グリッド
- `components/Toast.tsx:1` トースト表示
- `lib/config.ts:1` 公開環境変数の読み込み
- `lib/mastersFallback.ts:1` マスターの内蔵初期値
- `GAS/sample.gs:1` GASサンプル（Web App）
- `next.config.js:1` 静的出力/ベースパス設定
- `.github/workflows/deploy-pages.yml:1` GitHub Pages デプロイ

