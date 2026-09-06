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
│  └─ logo/
│     ├─ GGteens_Logo.jpg
│     ├─ GGteens_Logo_BK.png
│     └─ README.md
│
└─ css/
   ├─ base.css
   ├─ nav.css
   ├─ sections.css
   ├─ events.css
   └─ modal.css
```

## File responsibilities

- `index.html`：網站主要 HTML 結構，也是 GitHub Pages 的入口。
- `script.js`：資料載入、演出列表、詳細資料彈窗與互動功能。
- `style.css`：CSS 統一入口，以 `@import` 載入 `css/` 下的個別模組。
- `Data/`：網站使用的資料檔案。正式資料會逐步由 Notion 整理後匯入。
- `img/`：網站圖片與 Logo。
- `css/`：依功能拆分的 CSS，方便後續單獨修改導航、首頁區塊、演出與彈窗。

## Logo

網站左上方已預留正方形 Logo 顯示位置。

預定使用：

- `img/logo/GGteens_Logo.jpg`：正方形實心 Logo。
- `img/logo/GGteens_Logo_BK.png`：透明背景、僅文字 Logo。

目前尚未將實際圖檔加入 repository，因此網站會顯示 `GG` 佔位文字。

## Data source

網站的演出資料以 Notion「館青ㄉ演出紀錄」為主要資料來源。Notion 原資料不因網站製作而刪除或重建。
