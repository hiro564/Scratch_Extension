# OpenStreetMap Extension for Scratch VM

[日本語](#日本語) | [English](#english)

---

## 日本語

### 概要

Scratch VM / TurboWarp用のOpenStreetMap拡張ブロックです。地図の表示、経路探索、座標変換などの機能を提供します。

### 機能一覧

#### 🗺️ 地図表示機能
- **住所から地図を表示**: 日本の住所を入力して地図を表示
- **緯度・経度から地図を表示**: 座標を直接指定して地図を表示
- **ズームレベル調整**: 10〜20の範囲で0.25刻みで調整可能
- **地図の移動**: 上下左右に地図を動かす

#### 📍 座標変換機能
- スプライトの位置から緯度・経度を取得
- 緯度・経度からスプライトのx,y座標を取得
- 表示中の地図の端（北端・南端・東端・西端）の座標を取得

#### 📏 距離計算機能
- 2地点間の距離を計算（メートル単位）
- 1ピクセルが実際の何メートルに相当するかを取得

#### 🚶 移動機能
- **速度指定移動**: 秒速〇メートルで指定座標まで移動
- **経路探索移動**: OpenStreetMapのノード間の最短経路を計算して移動
- **精密な移動制御**: フレームレート非依存の正確な移動速度

#### 🏔️ 標高データ
- 指定した緯度・経度の標高を取得（メートル単位）

### インストール方法

#### 1. TurboWarp/scratch-vmへの組み込み

このファイルをscratch-vmの拡張機能として組み込む場合：

```bash
# scratch-vmのリポジトリをクローン
git clone https://github.com/TurboWarp/scratch-vm.git
cd scratch-vm

# 拡張機能ディレクトリに移動
cd src/extensions

# この拡張機能のファイルをコピー
# 例: scratch_openstreetmap ディレクトリを作成
mkdir scratch_openstreetmap
```

拡張機能のファイルを配置：
```
src/extensions/scratch_openstreetmap/
├── index.js
├── tile-map.js
└── tile-cache.js
```

#### 2. 拡張機能の登録

`src/extension-support/extension-manager.js` に拡張機能を登録：

```javascript
const builtinExtensions = {
    // 既存の拡張機能...
    openstreetmap: () => require('../extensions/scratch_openstreetmap')
};
```

#### 3. ビルド

```bash
npm install
npm run build
```

### 使い方

#### 基本的な使い方

1. **地図を表示する**
   ```
   住所 [神奈川県鎌倉市雪ノ下3丁目5-10] の地図をズームレベル [16] で表示
   ```

2. **スプライトを移動する**
   ```
   秒速 [1.5] メートルで緯度 [35.3251096] 経度 [139.558511] まで移動する
   ```

3. **距離を計算する**
   ```
   緯度[35.689185]経度[139.691648]から緯度[35.689500]経度[139.692000]までの距離(m)
   ```

#### 経路探索の使い方

1. **最短経路を計算**
   ```
   ノード[255479223]からノード[255479334]への最短経路を「Path」リストに追加
   ```

2. **経路に沿って移動**
   ```
   秒速 [1.0] メートルでリスト「Path」の経路に沿って移動する
   ```

### ブロック一覧

| カテゴリ | ブロック名 | 説明 |
|---------|----------|------|
| 地図表示 | 住所〜の地図を表示 | 住所から地図を表示 |
| 地図表示 | 緯度〜経度〜の地図を表示 | 座標から地図を表示 |
| 地図操作 | 地図を〜方向に動かす | 地図を移動 |
| 座標取得 | スプライトがいる場所の緯度 | 現在位置の緯度 |
| 座標取得 | スプライトがいる場所の経度 | 現在位置の経度 |
| 座標変換 | 緯度〜経度〜の場所のx座標 | 座標変換 |
| 座標変換 | 緯度〜経度〜の場所のy座標 | 座標変換 |
| 移動 | 秒速〜メートルで緯度〜経度〜まで移動 | 速度指定移動 |
| 距離 | 2地点間の距離 | 距離計算 |
| 距離 | 1pxが実際の何メートルに相当するか | スケール取得 |
| 標高 | 緯度〜経度〜の場所の高さ(m) | 標高取得 |
| 経路探索 | ノード〜からノード〜への最短経路 | 経路計算 |

### 技術仕様

- **タイルサーバー**: CartoDB Positron (建物・道路が強調されたスタイル)
- **フォールバック**: OpenStreetMap標準タイル
- **キャッシュサイズ**: 200タイル（調整可能）
- **ズーム範囲**: 10〜20（0.25刻み）
- **対応座標系**: WGS84（緯度・経度）
- **経路探索**: A*アルゴリズム（OpenStreetMapのノードグラフ使用）

### 注意事項

- タイルサーバーの利用規約を遵守してください
- 大量のタイル読み込みはサーバーに負荷をかける可能性があります
- 経路探索機能は道路ネットワークデータが必要です
- インターネット接続が必要です

### ライセンス

GPL-3.0

地図データ: © OpenStreetMap contributors

---

## English

### Overview

OpenStreetMap extension blocks for Scratch VM / TurboWarp. Provides map display, pathfinding, coordinate conversion, and more.

### Features

#### 🗺️ Map Display
- **Display map by address**: Show map from Japanese address
- **Display map by coordinates**: Show map from latitude/longitude
- **Zoom level control**: Adjustable from 10 to 20 in 0.25 increments
- **Pan map**: Move map in four directions

#### 📍 Coordinate Conversion
- Get latitude/longitude from sprite position
- Get x,y coordinates from latitude/longitude
- Get map boundary coordinates (north, south, east, west edges)

#### 📏 Distance Calculation
- Calculate distance between two points (in meters)
- Get how many meters one pixel represents

#### 🚶 Movement
- **Speed-based movement**: Move to coordinates at specified meters/second
- **Path following**: Calculate and follow shortest path between OpenStreetMap nodes
- **Precise movement control**: Frame-rate independent accurate movement

#### 🏔️ Elevation Data
- Get elevation at specified latitude/longitude (in meters)

### Installation

#### 1. Integration into TurboWarp/scratch-vm

To integrate as a scratch-vm extension:

```bash
# Clone scratch-vm repository
git clone https://github.com/TurboWarp/scratch-vm.git
cd scratch-vm

# Navigate to extensions directory
cd src/extensions

# Copy extension files
# Example: create scratch_openstreetmap directory
mkdir scratch_openstreetmap
```

Place extension files:
```
src/extensions/scratch_openstreetmap/
├── index.js
├── tile-map.js
└── tile-cache.js
```

#### 2. Register Extension

Register in `src/extension-support/extension-manager.js`:

```javascript
const builtinExtensions = {
    // Existing extensions...
    openstreetmap: () => require('../extensions/scratch_openstreetmap')
};
```

#### 3. Build

```bash
npm install
npm run build
```

### Usage

#### Basic Usage

1. **Display a map**
   ```
   Display map at address [Tokyo Tower] with zoom level [16]
   ```

2. **Move sprite**
   ```
   Move to latitude [35.3251096] longitude [139.558511] at [1.5] meters/second
   ```

3. **Calculate distance**
   ```
   Distance from lat[35.689185]lon[139.691648] to lat[35.689500]lon[139.692000] (m)
   ```

#### Pathfinding Usage

1. **Calculate shortest path**
   ```
   Find path from node[255479223] to node[255479334] and add to "Path" list
   ```

2. **Move along path**
   ```
   Move along "Path" list at [1.0] meters/second
   ```

### Block Reference

| Category | Block | Description |
|----------|-------|-------------|
| Map Display | Display map at address | Show map from address |
| Map Display | Display map at lat/lon | Show map from coordinates |
| Map Control | Move map in direction | Pan the map |
| Coordinates | Sprite's latitude | Current latitude |
| Coordinates | Sprite's longitude | Current longitude |
| Conversion | X coordinate at lat/lon | Coordinate conversion |
| Conversion | Y coordinate at lat/lon | Coordinate conversion |
| Movement | Move to lat/lon at speed | Speed-based movement |
| Distance | Distance between points | Calculate distance |
| Distance | Meters per pixel | Get scale |
| Elevation | Elevation at lat/lon | Get elevation |
| Pathfinding | Path from node to node | Calculate path |

### Technical Specifications

- **Tile Server**: CartoDB Positron (building/road emphasized style)
- **Fallback**: OpenStreetMap standard tiles
- **Cache Size**: 200 tiles (configurable)
- **Zoom Range**: 10-20 (0.25 increments)
- **Coordinate System**: WGS84 (latitude/longitude)
- **Pathfinding**: A* algorithm (using OpenStreetMap node graph)

### Notes

- Please comply with tile server terms of service
- Heavy tile loading may stress servers
- Pathfinding requires road network data
- Internet connection required

### License

GPL-3.0

Map data: © OpenStreetMap contributors

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

hiro564

## Repository

https://github.com/hiro564/scratch_extension
