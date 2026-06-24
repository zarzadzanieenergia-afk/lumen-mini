export const MAP_CENTER: [number, number] = [49.945, 21.62];
export const MAP_ZOOM = 12;

// Adresy usług Geoportalu/GUGiK należy okresowo weryfikować według
// oficjalnego wykazu usług WMS/WMTS na Geoportal.gov.pl/GUGiK.
export const MAP_LAYERS = {
  geoportalOrtho: {
    name: "Geoportal — ortofotomapa",
    url: "https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution",
    options: {
      layers: "Raster",
      format: "image/jpeg",
      transparent: false,
      attribution: "© GUGiK / Geoportal.gov.pl"
    }
  },
  osm: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors"
    }
  }
} as const;
