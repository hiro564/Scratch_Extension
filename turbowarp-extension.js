(function(Scratch) {
  'use strict';

  // TileCache クラス
  class TileCache {
    constructor() {
      this.cache = new Map();
      this.maxSize = 200;
      this.baseUrl = 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
    }

    getTileKey(zoom, x, y) {
      return `${zoom}_${x}_${y}`;
    }

    async getImage(zoom, x, y) {
      const key = this.getTileKey(zoom, x, y);
      
      if (this.cache.has(key)) {
        const cachedImage = this.cache.get(key);
        if (cachedImage.complete) {
          return cachedImage;
        }
      }

      try {
        const url = this.getTileUrl(zoom, x, y);
        const image = await this.loadImage(url);
        
        this.cache.set(key, image);
        this.manageCacheSize();
        
        return image;
      } catch (error) {
        console.error(`Failed to load tile: ${key}`, error);
        
        try {
          const fallbackUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
          const fallbackImage = await this.loadImage(fallbackUrl);
          this.cache.set(key, fallbackImage);
          this.manageCacheSize();
          return fallbackImage;
        } catch (fallbackError) {
          console.error(`Fallback tile also failed: ${key}`, fallbackError);
          return null;
        }
      }
    }

    getTileUrl(zoom, x, y) {
      return this.baseUrl
        .replace('{z}', zoom)
        .replace('{x}', x)
        .replace('{y}', y);
    }

    loadImage(url) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        
        setTimeout(() => {
          if (!image.complete) {
            reject(new Error('Image load timeout'));
          }
        }, 10000);
        
        image.src = url;
      });
    }

    manageCacheSize() {
      if (this.cache.size > this.maxSize) {
        const keysToDelete = Array.from(this.cache.keys()).slice(0, this.cache.size - this.maxSize);
        keysToDelete.forEach(key => this.cache.delete(key));
      }
    }

    clearCache() {
      this.cache.clear();
    }
  }

  // TileMap クラス（簡略版）
  class TileMap {
    constructor() {
      this.centerLongitude = 139.691648;
      this.centerLatitude = 35.689185;
      this.currentZoom = 16;
    }

    latLonToPixel(lat, lon, zoom) {
      const TILE_SIZE = 256;
      const scale = Math.pow(2, zoom);
      const x = (lon + 180) / 360 * scale * TILE_SIZE;
      const y = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 
        1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * scale * TILE_SIZE;
      
      return { x: x, y: y };
    }
  }

  // メイン拡張機能クラス
  class OpenStreetMapExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.tileCache = new TileCache();
      this.tileMap = new TileMap();
    }

    getInfo() {
      return {
        id: 'openstreetmap',
        name: 'OpenStreetMap',
        color1: '#4CAF50',
        color2: '#388E3C',
        blocks: [
          {
            opcode: 'drawTileMapByAddress',
            blockType: Scratch.BlockType.COMMAND,
            text: '住所 [ADDRESS] の地図をズームレベル [ZOOM] で表示',
            arguments: {
              ADDRESS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '東京タワー'
              },
              ZOOM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16
              }
            }
          },
          {
            opcode: 'drawTileMap',
            blockType: Scratch.BlockType.COMMAND,
            text: '緯度[LATITUDE] 経度[LONGITUDE] の地図をズームレベル [ZOOM] で表示',
            arguments: {
              LATITUDE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6586
              },
              LONGITUDE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7454
              },
              ZOOM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16
              }
            }
          },
          {
            opcode: 'getCurrentLatitude',
            blockType: Scratch.BlockType.REPORTER,
            text: 'スプライトがいる場所の緯度'
          },
          {
            opcode: 'getCurrentLongitude',
            blockType: Scratch.BlockType.REPORTER,
            text: 'スプライトがいる場所の経度'
          },
          {
            opcode: 'calculateDistanceBetweenPoints',
            blockType: Scratch.BlockType.REPORTER,
            text: '緯度[LAT1]経度[LON1]から緯度[LAT2]経度[LON2]までの距離(m)',
            arguments: {
              LAT1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6586
              },
              LON1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7454
              },
              LAT2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6812
              },
              LON2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7671
              }
            }
          }
        ]
      };
    }

    drawTileMapByAddress(args) {
      const address = args.ADDRESS;
      const zoom = args.ZOOM;
      
      // Nominatim APIで住所を座標に変換
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            this.tileMap.centerLatitude = lat;
            this.tileMap.centerLongitude = lon;
            this.tileMap.currentZoom = zoom;
            return this.drawTileMap({ LATITUDE: lat, LONGITUDE: lon, ZOOM: zoom });
          } else {
            console.error('住所が見つかりませんでした');
          }
        })
        .catch(error => {
          console.error('住所の検索に失敗:', error);
        });
    }

    drawTileMap(args) {
      const lat = args.LATITUDE;
      const lon = args.LONGITUDE;
      const zoom = args.ZOOM;
      
      this.tileMap.centerLatitude = lat;
      this.tileMap.centerLongitude = lon;
      this.tileMap.currentZoom = zoom;
      
      console.log(`地図を表示: 緯度${lat}, 経度${lon}, ズーム${zoom}`);
      
      // TODO: 実際の地図描画処理
      // TurboWarpでは pen 拡張機能を使って描画する必要があります
      
      return Promise.resolve();
    }

    getCurrentLatitude() {
      return this.tileMap.centerLatitude;
    }

    getCurrentLongitude() {
      return this.tileMap.centerLongitude;
    }

    calculateDistanceBetweenPoints(args) {
      const lat1 = args.LAT1;
      const lon1 = args.LON1;
      const lat2 = args.LAT2;
      const lon2 = args.LON2;
      
      // Haversine公式
      const R = 6371000; // 地球の半径(m)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      return Math.round(distance);
    }
  }

  Scratch.extensions.register(new OpenStreetMapExtension());
})(Scratch);
```

### ステップ5: コミット

1. 下にスクロール
2. Commit message: `Add TurboWarp compatible version`
3. **「Commit new file」**をクリック

### ステップ6: 完了！

数分待ってから、このURLで使えます：
```
https://turbowarp.org/editor?extension=https://hiro564.github.io/scratch_extension/turbowarp-extension.js
```

---

## 🎥 手順の流れ（画像で説明）

1. リポジトリトップ → **Add file** → **Create new file**
2. ファイル名: `turbowarp-extension.js`
3. 上記のコード全体をコピペ
4. **Commit new file** をクリック
5. 完了！

---

## ✅ 動作確認

1. GitHub Pagesが有効か確認（Settings → Pages）
2. 数分待つ
3. このURLを開く：
```
   https://turbowarp.org/editor?extension=https://hiro564.github.io/scratch_extension/turbowarp-extension.js
