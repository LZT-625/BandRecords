# BandRecords

「跟館青出去走一走」網站與資料歸檔專案。

## Repository structure

```text
BandRecords/
├─ index.html
├─ script.js
├─ style.css
├─ README.md
│
├─ Data/
│  └─ events.json
│
├─ img/
│  ├─ logo/
│  │  ├─ GGteens_Logo.jpg
│  │  ├─ GGteens_Logo_BK.png
│  │  └─ README.md
│  └─ mainpage/
│     └─ latest-promo.jpg   ← 請放最新官方宣傳圖
│
└─ css/
   ├─ base.css
   ├─ nav.css
   ├─ sections.css
   ├─ events.css
   └─ modal.css
```

## File responsibilities

- `index.html`：一頁式網站 HTML 結構，也是 GitHub Pages 的入口。
- `script.js`：演出資料載入、即將到來的演出、年度歌曲排行、Spotify 作品與活動詳細資料彈窗。
- `style.css`：CSS 統一入口，以 `@import` 載入 `css/` 下的個別模組。
- `Data/`：網站使用的資料檔案，正式資料逐步由 Notion 整理後匯入。
- `img/`：網站所有圖片。依用途在下面建立子資料夾，不限定只存放 Logo。
- `css/`：依功能拆分的 CSS，方便後續修改導航、首頁區塊、演出與彈窗。

## One-page layout

首頁目前由三個主要區塊組成：

- `#mainpage`：主視覺與最近大事。
- `#latest_event`：即將到來的 1–3 場演出。
- `#song_ranking`：2026 年歌曲演出機率排行，並包含 `#works` 作品區。

固定導航高度為 `80px`，左側為 Logo，中間留白，右側依序為「演出紀錄、館青的作品、年度回顧」。

## Logo

目前實際 Logo 已放入：

- `img/logo/GGteens_Logo.jpg`
- `img/logo/GGteens_Logo_BK.png`

網站直接顯示實際圖片，不再使用隱藏圖片的舊載入邏輯。

## Main page image

主視覺預留圖片位置：

- `img/mainpage/latest-promo.jpg`

GitHub repository 目前尚未有這張最新官方宣傳圖，因此網站在圖片尚未加入前會使用 CSS 背景色作為 fallback；加入檔案後主視覺會直接使用該圖片。

## Spotify

作品區使用 Spotify 官方 Embed iframe：

- 最新單曲：`open.spotify.com/embed/track/...`
- 《今天明天》：`open.spotify.com/embed/album/...`

## Data source

網站的演出資料以 Notion「館青ㄉ演出紀錄」為主要資料來源。Notion 原資料不因網站製作而刪除或重建。
