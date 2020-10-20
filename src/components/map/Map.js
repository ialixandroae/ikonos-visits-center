import React, { useEffect, useRef, useContext, useState } from "react";
import { loadModules } from "esri-loader";
import { store } from "../../store/store";
import { getFootprints, getFormattedBasemapName } from "../../helpers/helpers";

export const WebMapView = () => {
  const mapRef = useRef();
  const [mapView, setView] = useState(null);
  const [footprintsLayer, setFootprintsLayer] = useState(null);
  const [staticFootprintsLayer, setStaticFootprintsLayer] = useState(null);
  const globalState = useContext(store);
  const _basemap = globalState.state.basemap;
  const { dispatch } = globalState;
  // console.log("Global state: ", globalState);

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Expand",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Sketch",
        "esri/layers/GraphicsLayer",
        "esri/geometry/support/webMercatorUtils",
      ],
      { css: true }
    ).then(
      ([
        ArcGISMap,
        MapView,
        Expand,
        BasemapGallery,
        Sketch,
        GraphicsLayer,
        webMercatorUtils,
      ]) => {
        const layer = new GraphicsLayer();

        const ikonosFootprints = new GraphicsLayer();
        setFootprintsLayer(ikonosFootprints);

        const staticIkonosFootprints = new GraphicsLayer();
        setStaticFootprintsLayer(staticIkonosFootprints);

        const map = new ArcGISMap({
          basemap: _basemap,
          layers: layer,
        });

        // load the map view at the ref's DOM node
        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [15, 50],
          zoom: 5,
        });
        setView(view);

        const basemapGallery = new BasemapGallery({
          container: document.createElement("div"),
          view: view,
        });

        const basemapExpand = new Expand({
          expandIconClass: "esri-icon-basemap", // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
          view: view,
          content: basemapGallery.domNode,
        });
        view.ui.add(basemapExpand, "top-left");

        const sketch = new Sketch({
          layer: layer,
          view: view,
          availableCreateTools: ["rectangle"],
          layout: "vertical",
          // graphic will be selected as soon as it is created
          creationMode: "create",
        });

        view.ui.add(sketch, "top-right");

        const polygonSymbol = sketch.viewModel.polygonSymbol;
        polygonSymbol.color = [96, 56, 103, 0.4];
        polygonSymbol.outline = {
          color: [96, 56, 103],
          width: 2,
        };

        sketch.on("create", async (evt) => {
          if (evt.state === "complete") {
            const wgs84Rings = evt.graphic.geometry.rings[0].map((coord) => {
              // console.log(coord);
              return webMercatorUtils.xyToLngLat(coord[0], coord[1]);
            });
            // console.log(wgs84Rings);
            const payload = {
              aoiInGeoJson: {
                type: "Polygon",
                coordinates: [wgs84Rings],
              },
              geometry: "true",
            };
            layer.removeAll();
            layer.add(evt.graphic);

            let footprints = await getFootprints(
              globalState.state.baseURL,
              payload
            );
            if (footprints.length > 0) {
              footprints = footprints.sort(
                (a, b) =>
                  new Date(b.acquisitionDate) - new Date(a.acquisitionDate)
              );
              dispatch({ type: "SET_DATA", data: footprints });
              dispatch({ type: "SET_SEARCH_AREA", data: evt.graphic });
              dispatch({ type: "SET_VISIBLE_IMAGERY", data: [] });
              view.goTo(evt.graphic, { duration: 2000 });
            }
          }
        });

        map.watch("basemap.title", (newValue) => {
          // console.log(newValue);
          // console.log(getFormattedBasemapName(newValue));
          dispatch({
            type: "SET_BASEMAP",
            data: getFormattedBasemapName(newValue),
          });
        });

        return () => {
          if (view) {
            // destroy the map view
            view.container = null;
          }
        };
      }
    );
  }, []);

  useEffect(() => {
    if (!mapView) {
      return;
    }
    // console.log(globalState.state.visibleFootprints);
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [236, 243, 14, 0.4],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [236, 243, 14],
        width: 2,
      },
    };
    loadModules(["esri/Graphic"], { css: true }).then(([Graphic]) => {
      const _graphics = globalState.state.visibleFootprints.map((feature) => {
        return new Graphic({
          geometry: {
            type: "polygon", // autocasts as new Polygon()
            rings: feature.geometry.coordinates[0],
          },
          symbol: fillSymbol,
        });
      });
      footprintsLayer.removeAll();
      footprintsLayer.addMany(_graphics);
      mapView.map.add(footprintsLayer);
    });
  }, [globalState.state.visibleFootprints]);

  useEffect(() => {
    if (mapView === null) {
      return;
    }
    // console.log("Updated Visible Imagery");
    // console.log(globalState.state);
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [6, 156, 174, 0.4],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [6, 156, 174],
        width: 2,
      },
    };
    loadModules(["esri/Graphic"], { css: true }).then(([Graphic]) => {
      const _graphics = globalState.state.visibleImagery.map((feature) => {
        return new Graphic({
          geometry: {
            type: "polygon", // autocasts as new Polygon()
            rings: feature.geometry.coordinates[0],
          },
          symbol: fillSymbol,
        });
      });
      staticFootprintsLayer.removeAll();
      staticFootprintsLayer.addMany(_graphics);
      mapView.map.add(staticFootprintsLayer);
    });
  }, [globalState.state.visibleImagery]);

  return <div ref={mapRef} style={{ height: "100%" }}></div>;
};
