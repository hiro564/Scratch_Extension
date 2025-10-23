# Installation Guide / インストールガイド

[日本語](#日本語版インストールガイド) | [English](#english-installation-guide)

---

## 日本語版インストールガイド

### 前提条件

- Node.js 14.0.0以上
- Git
- TurboWarp/scratch-vmの開発環境

### ステップ1: scratch-vmのセットアップ

```bash
# scratch-vmをクローン
git clone https://github.com/TurboWarp/scratch-vm.git
cd scratch-vm

# 依存関係をインストール
npm install
```

### ステップ2: 拡張機能のインストール

```bash
# 拡張機能ディレクトリに移動
cd src/extensions

# OpenStreetMap拡張機能用のディレクトリを作成
mkdir scratch_openstreetmap
cd scratch_openstreetmap

# このリポジトリから3つのファイルをダウンロード
# 1. index.js
# 2. tile-map.js
# 3. tile-cache.js
```

**または、リポジトリをクローンする場合：**

```bash
cd src/extensions
git clone https://github.com/hiro564/scratch_extension.git scratch_openstreetmap
```

### ステップ3: 拡張機能の登録

`src/extension-support/extension-manager.js` を編集：

```javascript
const builtinExtensions = {
    // ... 既存の拡張機能
    pen: () => require('../extensions/scratch3_pen'),
    music: () => require('../extensions/scratch3_music'),
    
    // ここに追加
    openstreetmap: () => require('../extensions/scratch_openstreetmap'),
    
    // ... その他の拡張機能
};
```

### ステップ4: ビルドとテスト

```bash
# scratch-vmのルートディレクトリに戻る
cd ../../..

# ビルド
npm run build

# 開発サーバーを起動（オプション）
npm start
```

### ステップ5: scratch-guiとの統合（TurboWarpの場合）

```bash
# scratch-guiをクローン
cd ..
git clone https://github.com/TurboWarp/scratch-gui.git
cd scratch-gui

# scratch-vmをリンク
npm link ../scratch-vm

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザで `http://localhost:8601/` を開いて、拡張機能が利用できることを確認してください。

### トラブルシューティング

#### 拡張機能が表示されない

1. `extension-manager.js` に正しく登録されているか確認
2. ファイルパスが正しいか確認
3. ビルドエラーがないか確認: `npm run build`

#### ビルドエラーが発生する

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
npm run build
```

#### タイルが表示されない

- インターネット接続を確認
- ブラウザのコンソールでCORSエラーがないか確認
- タイルサーバーのURLが正しいか確認

---

## English Installation Guide

### Prerequisites

- Node.js 14.0.0 or higher
- Git
- TurboWarp/scratch-vm development environment

### Step 1: Set up scratch-vm

```bash
# Clone scratch-vm
git clone https://github.com/TurboWarp/scratch-vm.git
cd scratch-vm

# Install dependencies
npm install
```

### Step 2: Install Extension

```bash
# Navigate to extensions directory
cd src/extensions

# Create directory for OpenStreetMap extension
mkdir scratch_openstreetmap
cd scratch_openstreetmap

# Download three files from this repository:
# 1. index.js
# 2. tile-map.js
# 3. tile-cache.js
```

**Or, clone the repository:**

```bash
cd src/extensions
git clone https://github.com/hiro564/scratch_extension.git scratch_openstreetmap
```

### Step 3: Register Extension

Edit `src/extension-support/extension-manager.js`:

```javascript
const builtinExtensions = {
    // ... existing extensions
    pen: () => require('../extensions/scratch3_pen'),
    music: () => require('../extensions/scratch3_music'),
    
    // Add this line
    openstreetmap: () => require('../extensions/scratch_openstreetmap'),
    
    // ... other extensions
};
```

### Step 4: Build and Test

```bash
# Return to scratch-vm root directory
cd ../../..

# Build
npm run build

# Start development server (optional)
npm start
```

### Step 5: Integration with scratch-gui (for TurboWarp)

```bash
# Clone scratch-gui
cd ..
git clone https://github.com/TurboWarp/scratch-gui.git
cd scratch-gui

# Link scratch-vm
npm link ../scratch-vm

# Install dependencies
npm install

# Start development server
npm start
```

Open `http://localhost:8601/` in your browser and verify the extension is available.

### Troubleshooting

#### Extension not showing up

1. Verify correct registration in `extension-manager.js`
2. Check file paths are correct
3. Check for build errors: `npm run build`

#### Build errors

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

#### Tiles not displaying

- Check internet connection
- Check browser console for CORS errors
- Verify tile server URLs are correct

---

## Advanced Configuration

### Custom Tile Server

To use a different tile server, edit `tile-cache.js` and `tile-map.js`:

```javascript
// In tile-cache.js and tile-map.js
this.baseUrl = 'https://your-tile-server.com/{z}/{x}/{y}.png';
```

### Adjust Cache Size

In `tile-cache.js`:

```javascript
this.maxSize = 500; // Increase cache size
```

### Zoom Level Range

In `tile-map.js`:

```javascript
// Adjust zoom range (min, max, step)
this.zoomLevels = this.generateZoomLevels(8, 22, 0.25);
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/hiro564/scratch_extension/issues
- TurboWarp Documentation: https://docs.turbowarp.org/

## Map Data Attribution

Map tiles and data © OpenStreetMap contributors
- OpenStreetMap: https://www.openstreetmap.org/copyright
- CartoDB: https://carto.com/attributions
