(function(Scratch) {
  'use strict';

  class OpenStreetMapExtension {
    getInfo() {
      return {
        id: 'openstreetmap',
        name: 'OpenStreetMap',
        color1: '#4CAF50',
        color2: '#388E3C',
        color3: '#2E7D32',
        blocks: [
          {
            opcode: 'setMapCenterByAddress',
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
            opcode: 'calculateDistance',
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
            opcode: 'getDistanceFromCenter',
            blockType: Scratch.BlockType.REPORTER,
            text: '中心から緯度[LAT] 経度[LON]までの距離(m)',
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

    constructor() {
      this.centerLatitude = 35.689185;
      this.centerLongitude = 139.691648;
      this.currentZoom = 16;
    }

    setMapCenterByAddress(args) {
      const address = String(args.ADDRESS);
      const zoom = Number(args.ZOOM);
      
      const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + 
                  encodeURIComponent(address) + '&limit=1';
      
      return Scratch.fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            this.centerLatitude = parseFloat(data[0].lat);
            this.centerLongitude = parseFloat(data[0].lon);
            this.currentZoom = zoom;
          }
        })
        .catch(() => {});
    }

    setMapCenter(args) {
      this.centerLatitude = Number(args.LATITUDE);
      this.centerLongitude = Number(args.LONGITUDE);
    }

    setZoom(args) {
      this.currentZoom = Number(args.ZOOM);
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

    calculateDistance(args) {
      const lat1 = Number(args.LAT1);
      const lon1 = Number(args.LON1);
      const lat2 = Number(args.LAT2);
      const lon2 = Number(args.LON2);
      
      return this._haversine(lat1, lon1, lat2, lon2);
    }

    getDistanceFromCenter(args) {
      const lat = Number(args.LAT);
      const lon = Number(args.LON);
      
      return this._haversine(this.centerLatitude, this.centerLongitude, lat, lon);
    }

    _haversine(lat1, lon1, lat2, lon2) {
      const R = 6371000;
      const toRad = Math.PI / 180;
      const dLat = (lat2 - lat1) * toRad;
      const dLon = (lon2 - lon1) * toRad;
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
      return Math.round(R * c);
    }

    getBearing(args) {
      const lat1 = Number(args.LAT1) * Math.PI / 180;
      const lon1 = Number(args.LON1) * Math.PI / 180;
      const lat2 = Number(args.LAT2) * Math.PI / 180;
      const lon2 = Number(args.LON2) * Math.PI / 180;
      
      const dLon = lon2 - lon1;
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      
      let bearing = Math.atan2(y, x) * 180 / Math.PI;
      bearing = (bearing + 360) % 360;
      
      return Math.round(bearing * 10) / 10;
    }

    getMapUrl() {
      return 'https://www.openstreetmap.org/#map=' + 
             this.currentZoom + '/' + 
             this.centerLatitude + '/' + 
             this.centerLongitude;
    }
  }

  Scratch.extensions.register(new OpenStreetMapExtension());
})(Scratch);
