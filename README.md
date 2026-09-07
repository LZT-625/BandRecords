# BandRecords

「跟館青出去走一走」網站與資料歸檔專案。

## Repository structure

```text
BandRecords/
├─ index.html
├─ script.js
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
- `script.js`：演出資料載入、首頁換頁／滾動、即將到來的演出、年度歌曲排行、Spotify 作品與活動詳細資料彈窗。
- `style.css`：CSS 統一入口，以 `@import` 載入 `css/` 下的個別模組。
- `Data/`：網站使用的資料檔案，正式資料逐步由 Notion 整理後匯入。
- `img/`：網站所有圖片。依用途在下面建立子資料夾，不限定只存放 Logo。
- `css/`：依功能拆分的 CSS，方便後續修改導航、首頁區塊、演出與彈窗。

## One-page layout

首頁目前由兩個主要區塊組成：

- `#mainpage`：主視覺與最近大事。
- `#latest_event`：即將到來的 1–3 場演出。

固定導航高度為 `80px`，左側為 Logo，中間留白，右側依序為「演出紀錄、館青的作品、年度回顧」。

首頁目前採測試中的分段滾動模式：首次開啟首頁會定位在 `#mainpage`，在頁面頂端向下滾動時自動平滑定位到 `#latest_event`。

## Event data format

`Data/events.json` 每筆活動應至少保留以下欄位：

- `title`：活動名稱。
- `date`：活動日期，格式 `YYYY-MM-DD`。
- `is_datetime`：是否有明確演出時間。
- `time` / `end_time`：演出開始與結束時間，沒有時間時填 `null`。
- `city` / `city_region`：城市與區域分類。
- `venue`：活動地點簡稱。
- `location_name`：Notion「地點名稱」，供活動詳細資料與 Google Maps 查找使用。
- `address`：Notion「詳細地址」，演出紀錄列表的簡易地址資訊只使用此欄位，不以城市／區域名稱取代。
- `type`：活動類型，例如「大專場」、「校園演唱會」、「音樂祭/節」。
- `fee`：票務狀態，請填 `付費` 或 `免費`；此欄位會作為首頁活動卡的票務標籤來源。手動新增活動時務必填寫。
- `source`：活動官方資訊來源。
- `notion_url`：對應的 Notion 演出紀錄頁。
- `location_notion_url`：對應的 Notion 地點頁。
- `songs`：該場演出的歌單資料。

網站不會將 `GO？` 狀態公開顯示。

## Logo

目前實際 Logo 已放入：

- `img/logo/GGteens_Logo.jpg`
- `img/logo/GGteens_Logo_BK.png`

網站導覽列目前以文字 `GGteens` 作為公開顯示名稱。

## Main page image

主視覺背景使用：

- `img/mainpage/Main_BG.jpg`

## Spotify

作品區使用 Spotify 官方 Embed iframe：

- 最新單曲：`open.spotify.com/embed/track/...`
- 《今天明天》：`open.spotify.com/embed/album/...`

## Data source

網站的演出資料以 Notion「館青ㄉ演出紀錄」為主要資料來源。Notion 原資料不因網站製作而刪除或重建。
