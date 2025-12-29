<div align="center">
  <img width="1200" alt="FB/IG 排版轉換神器" src="https://fb-format.vivichen.ai/og-image.png" />
  
  # FB/IG 排版轉換神器
  
  **讓你的 Facebook 和 Instagram 貼文更專業！**
  
  [🌐 線上使用](https://fb-format.vivichen.ai) | [📖 使用說明](#使用說明) | [🛠️ 技術棧](#技術棧)
  
</div>

---

## 📝 專案簡介

FB/IG 排版轉換神器是一個專為 Facebook 和 Instagram 貼文設計的排版工具，幫助你輕鬆保留空行與縮排，讓你的貼文排版更加專業美觀。

### ✨ 主要功能

- 🎨 **自動保留空行與縮排** - 完美呈現你的排版設計
- 🔒 **100% 隱私保護** - 所有運算皆在瀏覽器內完成，檔案不會上傳至雲端伺服器
- 📱 **響應式設計** - 完美支援桌面和行動裝置
- 🎯 **符號選單** - 豐富的表情符號和特殊符號快速插入
- ⚡ **即時預覽** - 即時查看轉換後的結果
- 🎭 **可愛吉祥物** - 互動式角色陪伴你的編輯過程

## 🚀 快速開始

### 前置需求

- Node.js (建議 v18 或以上)
- npm 或 yarn

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/ViviChen-nocode/fb-format.git
   cd fb-format
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

4. **開啟瀏覽器**
   
   訪問 `http://localhost:3000` 即可開始使用

### 建置生產版本

```bash
npm run build
```

建置完成後，檔案會輸出到 `dist` 目錄。

## 📖 使用說明

1. **輸入文字** - 在左側編輯區輸入你想要轉換的文字
2. **選擇符號** - 從右側符號選單選擇想要插入的表情符號或特殊符號
3. **複製結果** - 點擊「複製」按鈕，將轉換後的文字複製到剪貼簿
4. **貼上使用** - 直接貼到 Facebook 或 Instagram 的貼文編輯器中

## 🛠️ 技術棧

- **前端框架**: React 19
- **開發語言**: TypeScript
- **建置工具**: Vite 6
- **樣式框架**: Tailwind CSS
- **圖示庫**: Lucide React
- **部署平台**: Cloudflare Pages

## 🌐 線上版本

**立即使用**: [https://fb-format.vivichen.ai](https://fb-format.vivichen.ai)

## 📦 專案結構

```
fb-format/
├── components/          # React 元件
│   ├── MascotCharacter.tsx
│   ├── SymbolPicker.tsx
│   └── TextConverter.tsx
├── public/              # 靜態資源
│   ├── favicon.ico
│   ├── manifest.json
│   └── og-image.png
├── assets/              # 圖片資源
├── App.tsx              # 主應用程式元件
├── index.html           # HTML 模板
├── index.tsx            # 應用程式入口
├── vite.config.ts       # Vite 設定檔
└── package.json         # 專案依賴
```

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

本專案採用 MIT 授權。

## 👤 作者

**Vivi Chen 大師姐**

- Facebook: [@vivichen.sister](https://www.facebook.com/vivichen.sister)
- 網站: [https://fb-format.vivichen.ai](https://fb-format.vivichen.ai)

---

<div align="center">
  Made with ❤️ by <a href="https://www.facebook.com/vivichen.sister">Vivi Chen 大師姐</a> | © 2025
</div>
