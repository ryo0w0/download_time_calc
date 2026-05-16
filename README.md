# Download Time Calculator

A simple, fast, and customizable web tool to calculate download time based on file size and connection speed. Available in both English and Japanese. Installable as a PWA.

🔗 **Live Demo:** [https://ryo0w0.github.io/download_time_calc/](https://ryo0w0.github.io/download_time_calc/)

---

## Features

- Calculate download time instantly from file size and connection speed
- Supports units: MB / GB / TB and Kbps / Mbps / Gbps
- Configurable file size base (1GB = 1000MB or 1GB = 1024MB)
- History log — stores up to 5 recent calculations locally
- **Desktop:** 2-column layout — input form (left, sticky) + history panel (right, scrollable)
- **Mobile:** Swipe UI — finger-tracking page transition between input and history (like a home screen)
- History display style can be switched between Swipe and Stack in Settings (mobile only)
- Theme switcher: Light, Dark, Gray Dark
- 10+ accent color options (Mono, Blue, Green, Purple, Orange, Red, Pink, Cyan, Mint, Lemon, Rose)
- Bilingual UI: Japanese / English
- PWA support — installable on mobile and desktop, works offline
- Responsive design, works on any device

## Usage

1. Enter the **file size** and select a unit (MB / GB / TB)
2. Enter the **connection speed** and select a unit (Kbps / Mbps / Gbps)
3. Click **Calculate** to see the estimated download time
4. Open **Settings (⚙️)** to customize theme, accent color, size base, and history

> On mobile, swipe left to view the history panel, or swipe right to return to the input form.

## Tech Stack

- HTML / CSS / Vanilla JavaScript (no frameworks, no dependencies)
- PWA (Service Worker + Web App Manifest)
- Google Analytics (gtag.js)

## Project Structure

```
download_time_calc/
├── index.html              # Main application page
├── favicon.svg             # App icon (SVG)
├── manifest.json           # PWA manifest
├── css/
│   ├── style.css           # Base styles, themes, components
│   ├── layout-desktop.css  # 2-column desktop layout (768px+)
│   └── swipe.css           # Mobile swipe UI (< 768px)
├── js/
│   ├── main.js             # Application logic
│   └── service-worker.js   # Offline caching
├── data/
│   ├── ja.json             # Japanese translations
│   └── en.json             # English translations
├── images/                 # PWA icons (192x192, 512x512, apple-touch-icon)
├── pages/
│   └── privacy.html        # Privacy policy
└── TASK_PROPOSALS.md       # Development task notes
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
- **デスクトップ:** 2カラムレイアウト — 入力フォーム（左・sticky固定）＋ 履歴パネル（右・スクロール）
- **モバイル:** スワイプUI — ホーム画面のように指に追従するページ切り替えで入力と履歴を行き来
- 設定から履歴の表示スタイルをスワイプ / 下積み で切り替え可能（モバイルのみ）
- テーマ切り替え: ライト / ダーク / グレーダーク
- 10種類以上のアクセントカラー（モノクロ、ブルー、グリーン、パープル、オレンジ、レッド、ピンク、シアン、ミント、レモン、ローズ）
- 日本語 / 英語の切り替えに対応
- PWA対応 — スマートフォン・PCにインストール可能、オフラインでも動作
- レスポンシブデザイン対応

## 使い方

1. **ファイルサイズ**を入力し、単位（MB / GB / TB）を選択
2. **回線速度**を入力し、単位（Kbps / Mbps / Gbps）を選択
3. **「計算する」**をクリックするとダウンロード時間が表示される
4. 右上の **設定（⚙️）**からテーマ・アクセントカラー・サイズ基準・履歴機能をカスタマイズ可能

> モバイルでは左にスワイプすると履歴パネルへ、右にスワイプすると入力フォームに戻ります。

## 使用技術

- HTML / CSS / Vanilla JavaScript（フレームワーク・依存ライブラリなし）
- PWA（Service Worker + Web App Manifest）
- Google Analytics（gtag.js）

## ディレクトリ構成

```
download_time_calc/
├── index.html              # メインページ
├── favicon.svg             # アプリアイコン（SVG）
├── manifest.json           # PWAマニフェスト
├── css/
│   ├── style.css           # ベーススタイル・テーマ・コンポーネント
│   ├── layout-desktop.css  # デスクトップ2カラムレイアウト（768px以上）
│   └── swipe.css           # モバイルスワイプUI（768px未満）
├── js/
│   ├── main.js             # アプリケーションロジック
│   └── service-worker.js   # オフラインキャッシュ
├── data/
│   ├── ja.json             # 日本語翻訳
│   └── en.json             # 英語翻訳
├── images/                 # PWAアイコン（192x192, 512x512, apple-touch-icon）
├── pages/
│   └── privacy.html        # プライバシーポリシー
└── TASK_PROPOSALS.md       # 開発タスクメモ
```

## ライセンス

現在、ライセンスは指定されていません。
