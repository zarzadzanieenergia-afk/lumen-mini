import { Fragment } from "react";
import { CircleMarker, LayersControl, MapContainer, Polyline, Popup, TileLayer, WMSTileLayer } from "react-leaflet";
import type { GlobalParameters, LightingSection } from "../types";
import { MAP_CENTER, MAP_LAYERS, MAP_ZOOM } from "../config/mapLayers";
import { calculateSection } from "../utils/calculations";
import { labels, number } from "../utils/format";

export default function MapView({ sections, params }: { sections: LightingSection[]; params: GlobalParameters }) {
  const color = (section: LightingSection) =>
    section.sectionType === "istniejacy" && ["do_weryfikacji", "awarie"].includes(section.technicalCondition ?? "")
      ? "#d97706" : section.sectionType === "istniejacy" ? "#16805b" : "#2563eb";

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div>
          <h2 className="section-title">Mapa odcinków</h2>
          <p className="text-sm text-slate-500">{sections.length} odcinków w lokalnej ewidencji</p>
        </div>
        <div className="flex gap-3 text-xs font-medium text-slate-600">
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />Istniejące</span>
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />Planowane</span>
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-amber-600" />Do weryfikacji</span>
        </div>
      </div>
      <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom className="z-0">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name={MAP_LAYERS.osm.name}>
            <TileLayer {...MAP_LAYERS.osm.options} url={MAP_LAYERS.osm.url} />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name={MAP_LAYERS.geoportalOrtho.name}>
            <WMSTileLayer
              url={MAP_LAYERS.geoportalOrtho.url}
              layers={MAP_LAYERS.geoportalOrtho.options.layers}
              format={MAP_LAYERS.geoportalOrtho.options.format}
              transparent={MAP_LAYERS.geoportalOrtho.options.transparent}
              attribution={MAP_LAYERS.geoportalOrtho.options.attribution}
            />
          </LayersControl.Overlay>
        </LayersControl>
        {sections.map(section => {
          const c = calculateSection(section, params);
          return (
            <Fragment key={section.id}>
              <Polyline positions={[[section.startLat, section.startLon], [section.endLat, section.endLon]]} pathOptions={{ color: color(section), weight: 6, opacity: .88 }}>
                <Popup>
                <div className="min-w-56 text-sm">
                  <strong className="text-base text-ink">{section.name}</strong>
                  <p className="mb-2 text-slate-500">{labels[section.sectionType]} · {section.locality}</p>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <dt>Droga</dt><dd className="font-semibold">{section.roadType}</dd>
                    <dt>Długość</dt><dd className="font-semibold">{number(section.lengthM, 0)} m</dd>
                    <dt>Oprawy</dt><dd className="font-semibold">{section.lampsCount} × {section.lampPowerW} W</dd>
                    <dt>Moc</dt><dd className="font-semibold">{number(c.powerKw)} kW</dd>
                    <dt>Energia</dt><dd className="font-semibold">{number(c.energyMwh)} MWh/rok</dd>
                    <dt>Koszt</dt><dd className="font-semibold">{number(c.energyCostPln, 0)} zł/rok</dd>
                    <dt>Emisja CO₂</dt><dd className="font-semibold">{number(c.emissionsMg)} Mg/rok</dd>
                  </dl>
                </div>
                </Popup>
              </Polyline>
              <CircleMarker center={[section.startLat, section.startLon]} radius={6} pathOptions={{ color: "#fff", weight: 2, fillColor: color(section), fillOpacity: 1 }} />
              <CircleMarker center={[section.endLat, section.endLon]} radius={6} pathOptions={{ color: "#fff", weight: 2, fillColor: color(section), fillOpacity: 1 }} />
            </Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
