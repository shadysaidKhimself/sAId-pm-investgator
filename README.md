# AI PM Requirement Collector

一款由 AI 驅動的 B2B 需求訪談工具，協助 PM 在正式會議前自動完成初步需求收集與分析。

## 功能

- **AI 訪談對話**：由 Claude (claude-sonnet-4-6) 扮演資深 PM 助理，以自然對話方式引導客戶釐清需求
- **即時串流回應**：對話採 Server-Sent Events 串流，回應即時呈現
- **訪談進度追蹤**：側邊欄顯示七大訪談 Checklist 的完成進度
  1. 開場與建立信任
  2. 商業模式確認
  3. 現有流程 As-Is
  4. 使用者角色
  5. 角色行為與權限
  6. 理想流程 To-Be
  7. 決策目標與 BDD 場景
- **雙版本輸出**：訪談結束後自動產生客戶版需求確認文件（顯示於對話、同時存檔）及 PM 內部分析文件（僅存檔，不對外顯示）
- **自動存檔**：訪談完成後將 PM 內部文件自動儲存至 Google Drive
- **對話歷史**：可瀏覽並繼續所有歷史訪談記錄

## 技術架構

| 層級 | 技術 |
|------|------|
| 前端 | React 19 + TypeScript + Vite |
| 樣式 | Tailwind CSS v4 |
| AI   | Anthropic Claude API（claude-sonnet-4-6） |
| 部署 | Vercel（Serverless Functions） |
| 存檔 | Google Drive API（Service Account） |

## 環境設定

複製 `.env` 並填入以下變數：

```
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_SERVICE_ACCOUNT_JSON=<Base64 編碼的 Service Account JSON>
GOOGLE_DRIVE_FOLDER_ID=<Google Drive 資料夾 ID>
```

## 本地開發

```bash
npm install
npm run dev
```

## 部署

```bash
npx vercel
```
