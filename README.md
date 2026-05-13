# Download Time Calculator

A simple, fast, and customizable web tool to calculate download time based on file size and connection speed. Available in both English and Japanese. Installable as a PWA.

🔗 **Live Demo:** [https://ryo0w0.github.io/download_time_calc/](https://ryo0w0.github.io/download_time_calc/)

---

## Features

- Calculate download time instantly from file size and connection speed
- Supports units: MB / GB / TB and Kbps / Mbps / Gbps
- Configurable file size base (1GB = 1000MB or 1GB = 1024MB)
- History log — stores up to 5 recent calculations locally
- Theme switcher: Light, Dark, Gray Dark
- 10+ accent color options (Mono, Blue, Green, Purple, Orange, Red, Pink, Cyan, Mint, Lemon, Rose)
- Bilingual UI: Japanese / English
- PWA support — installable on mobile and desktop
- Responsive design, works on any device

## Usage

1. Enter the **file size** and select a unit (MB / GB / TB)
2. Enter the **connection speed** and select a unit (Kbps / Mbps / Gbps)
3. Click **Calculate** to see the estimated download time
4. Open **Settings (⚙️)** to customize theme, accent color, size base, and history

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- PWA (Service Worker + Web App Manifest)
- Google Analytics (gtag.js)

## Project Structure

```
download_time_calc/
├── index.html          # Main application page
├── favicon.svg         # App icon
├── manifest.json       # PWA manifest
├── css/
│   └── style.css       # Styles
├── js/
│   ├── main.js         # Application logic
│   └── service-worker.js
├── images/             # App icons (PWA)
├── pages/
│   └── privacy.html    # Privacy policy page
├── data/               # Static data assets
└── TASK_PROPOSALS.md   # Development task notes
```

## License

This project does not currently specify a license.

---

## 日本語ドキュメント / Japanese

> 👆 English documentation is above. Below is the Japanese version.

# ダウンロード時間計算

ファイルサイズと回線速度からダウンロード時間を即座に計算できる、シンプルで軽量なWebツールです。PWAとしてインストールすることもできます。

🔗 **デモ:** [https://ryo0w0.github.io/download_time_calc/](https://ryo0w0.github.io/download_time_calc/)

---

## 機能

- ファイルサイズと回線速度を入力するだけで瞬時にダウンロード時間を計算
- 単位対応: MB / GB / TB、Kbps / Mbps / Gbps
- ファイルサイズ基準の切り替え（1GB = 1000MB または 1GB = 1024MB）
- 履歴機能 — 直近5件の計算結果をローカルに保存
- テーマ切り替え: ライト / ダーク / グレーダーク
- 10種類以上のアクセントカラー（モノクロ、ブルー、グリーン、パープル、オレンジ、レッド、ピンク、シアン、ミント、レモン、ローズ）
- 日本語 / 英語の切り替えに対応
- PWA対応 — スマートフォン・PCにインストール可能
- レスポンシブデザイン対応

## 使い方

1. **ファイルサイズ**を入力し、単位（MB / GB / TB）を選択
2. **回線速度**を入力し、単位（Kbps / Mbps / Gbps）を選択
3. **「計算する」**をクリックするとダウンロード時間が表示される
4. 右上の **設定（⚙️）**からテーマ・アクセントカラー・サイズ基準・履歴機能をカスタマイズ可能

## 使用技術

- HTML / CSS / Vanilla JavaScript
- PWA（Service Worker + Web App Manifest）
- Google Analytics（gtag.js）

## ディレクトリ構成

```
download_time_calc/
├── index.html          # メインページ
├── favicon.svg         # アプリアイコン
├── manifest.json       # PWAマニフェスト
├── css/
│   └── style.css       # スタイルシート
├── js/
│   ├── main.js         # アプリケーションロジック
│   └── service-worker.js
├── images/             # アプリアイコン（PWA用）
├── pages/
│   └── privacy.html    # プライバシーポリシー
├── data/               # 静的データ
└── TASK_PROPOSALS.md   # 開発タスクメモ
```

## ライセンス

現在、ライセンスは指定されていません。
