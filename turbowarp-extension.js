(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('この拡張機能はサンドボックス化されていない環境で実行する必要があります');
  }

  // メイン拡張機能クラス
  class OpenStreetMapExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.centerLongitude = 139.691648;
      this.centerLatitude = 35.689185;
      this.currentZoom = 16;
    }

    getInfo() {
      return {
        id: 'openstreetmap',
        name: 'OpenStreetMap',
        color1: '#4CAF50',
        color2: '#388E3C',
        color3: '#2E7D32',
        blocks: [
          {
            opcode: 'drawTileMapByAddress',
            blockType: Scratch.BlockType.COMMAND,
            text: '住所 [ADDRESS] の地図を中心にする（ズーム [ZOOM]）',
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
            opcode: 'setMapCenter',
            blockType: Scratch.BlockType.COMMAND,
            text: '地図の中心を緯度 [LATITUDE] 経度 [LONGITUDE] にする',
            arguments: {
              LATITUDE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6586
              },
              LONGITUDE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7454
              }
            }
          },
          {
            opcode: 'setZoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ズームレベルを [ZOOM] にする',
            arguments: {
              ZOOM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16
              }
            }
          },
          '---',
          {
            opcode: 'getCurrentLatitude',
            blockType: Scratch.BlockType.REPORTER,
            text: '地図の中心の緯度'
          },
          {
            opcode: 'getCurrentLongitude',
            blockType: Scratch.BlockType.REPORTER,
            text: '地図の中心の経度'
          },
          {
            opcode: 'getCurrentZoom',
            blockType: Scratch.BlockType.REPORTER,
            text: '現在のズームレベル'
          },
          '---',
          {
            opcode: 'calculateDistanceBetweenPoints',
            blockType: Scratch.BlockType.REPORTER,
            text: '緯度[LAT1] 経度[LON1]から緯度[LAT2] 経度[LON2]までの距離(m)',
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
          },
          {
            opcode: 'getDistanceToCoordinate',
            blockType: Scratch.BlockType.REPORTER,
            text: '現在地から緯度[LAT] 経度[LON]までの距離(m)',
            arguments: {
              LAT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6812
              },
              LON: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7671
              }
            }
          },
          '---',
          {
            opcode: 'getBearing',
            blockType: Scratch.BlockType.REPORTER,
            text: '緯度[LAT1] 経度[LON1]から緯度[LAT2] 経度[LON2]への方角(度)',
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
          },
          {
            opcode: 'getMapUrl',
            blockType: Scratch.BlockType.REPORTER,
            text: '現在の地図のURL'
          }
        ]
      };
    }

    drawTileMapByAddress(args) {
      const address = Scratch.Cast.toString(args.ADDRESS);
      const zoom = Scratch.Cast.toNumber(args.ZOOM);
      
      // Nominatim APIで住所を座標に変換
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      
      return fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            this.centerLatitude = parseFloat(data[0].lat);
            this.centerLongitude = parseFloat(data[0].lon);
            this.currentZoom = zoom;
            console.log(`地図を設定: ${address} (緯度${this.centerLatitude}, 経度${this.centerLongitude})`);
          } else {
            console.error('住所が見つかりませんでした:', address);
          }
        })
        .catch(error => {
          console.error('住所の検索に失敗:', error);
        });
    }

    setMapCenter(args) {
      this.centerLatitude = Scratch.Cast.toNumber(args.LATITUDE);
      this.centerLongitude = Scratch.Cast.toNumber(args.LONGITUDE);
      console.log(`地図の中心を設定: 緯度${this.centerLatitude}, 経度${this.centerLongitude}`);
    }

    setZoom(args) {
      this.currentZoom = Scratch.Cast.toNumber(args.ZOOM);
      console.log(`ズームレベルを設定: ${this.currentZoom}`);
    }

    getCurrentLatitude() {
      return this.centerLatitude;
    }

    getCurrentLongitude() {
      return this.centerLongitude;
    }

    getCurrentZoom() {
      return this.currentZoom;
    }

    calculateDistanceBetweenPoints(args) {
      const lat1 = Scratch.Cast.toNumber(args.LAT1);
      const lon1 = Scratch.Cast.toNumber(args.LON1);
      const lat2 = Scratch.Cast.toNumber(args.LAT2);
      const lon2 = Scratch.Cast.toNumber(args.LON2);
      
      return this._calculateDistance(lat1, lon1, lat2, lon2);
    }

    getDistanceToCoordinate(args) {
      const lat = Scratch.Cast.toNumber(args.LAT);
      const lon = Scratch.Cast.toNumber(args.LON);
      
      return this._calculateDistance(this.centerLatitude, this.centerLongitude, lat, lon);
    }

    _calculateDistance(lat1, lon1, lat2, lon2) {
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

    getBearing(args) {
      const lat1 = Scratch.Cast.toNumber(args.LAT1) * Math.PI / 180;
      const lon1 = Scratch.Cast.toNumber(args.LON1) * Math.PI / 180;
      const lat2 = Scratch.Cast.toNumber(args.LAT2) * Math.PI / 180;
      const lon2 = Scratch.Cast.toNumber(args.LON2) * Math.PI / 180;
      
      const dLon = lon2 - lon1;
      
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      
      let bearing = Math.atan2(y, x) * 180 / Math.PI;
      bearing = (bearing + 360) % 360; // 0-360度に正規化
      
      return Math.round(bearing * 10) / 10; // 小数点1桁
    }

    getMapUrl() {
      // OpenStreetMapの地図URLを返す
      return `https://www.openstreetmap.org/#map=${this.currentZoom}/${this.centerLatitude}/${this.centerLongitude}`;
    }
  }

  Scratch.extensions.register(new OpenStreetMapExtension());
})(Scratch);
