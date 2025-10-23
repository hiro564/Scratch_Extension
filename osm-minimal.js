(function(Scratch) {
  'use strict';

  class OpenStreetMapExtension {
    getInfo() {
      return {
        id: 'openstreetmap',
        name: 'OpenStreetMap',
        color1: '#4CAF50',
        color2: '#388E3C',
        blocks: [
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
          '---',
          {
            opcode: 'getMapUrl',
            blockType: Scratch.BlockType.REPORTER,
            text: '現在の地図のURL'
          },
          {
            opcode: 'getMapUrlForCoordinate',
            blockType: Scratch.BlockType.REPORTER,
            text: '緯度[LAT] 経度[LON] ズーム[ZOOM]の地図URL',
            arguments: {
              LAT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 35.6586
              },
              LON: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 139.7454
              },
              ZOOM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16
              }
            }
          }
        ]
      };
    }

    constructor() {
      this.centerLatitude = 35.689185;
      this.centerLongitude = 139.691648;
      this.currentZoom = 16;
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
      var lat1 = Number(args.LAT1);
      var lon1 = Number(args.LON1);
      var lat2 = Number(args.LAT2);
      var lon2 = Number(args.LON2);
      return this.haversine(lat1, lon1, lat2, lon2);
    }

    getDistanceFromCenter(args) {
      var lat = Number(args.LAT);
      var lon = Number(args.LON);
      return this.haversine(this.centerLatitude, this.centerLongitude, lat, lon);
    }

    haversine(lat1, lon1, lat2, lon2) {
      var R = 6371000;
      var toRad = 0.017453292519943295;
      var dLat = (lat2 - lat1) * toRad;
      var dLon = (lon2 - lon1) * toRad;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c);
    }

    getBearing(args) {
      var lat1 = Number(args.LAT1) * 0.017453292519943295;
      var lon1 = Number(args.LON1) * 0.017453292519943295;
      var lat2 = Number(args.LAT2) * 0.017453292519943295;
      var lon2 = Number(args.LON2) * 0.017453292519943295;
      var dLon = lon2 - lon1;
      var y = Math.sin(dLon) * Math.cos(lat2);
      var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      var bearing = Math.atan2(y, x) * 57.29577951308232;
      bearing = (bearing + 360) % 360;
      return Math.round(bearing * 10) / 10;
    }

    getMapUrl() {
      return 'https://www.openstreetmap.org/#map=' + 
             this.currentZoom + '/' + 
             this.centerLatitude + '/' + 
             this.centerLongitude;
    }

    getMapUrlForCoordinate(args) {
      var lat = Number(args.LAT);
      var lon = Number(args.LON);
      var zoom = Number(args.ZOOM);
      return 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
    }
  }

  Scratch.extensions.register(new OpenStreetMapExtension());
})(Scratch);
