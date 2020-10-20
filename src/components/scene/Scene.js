import React, { useEffect, useRef, useContext, useState } from "react";
import { loadModules } from "esri-loader";
import { store } from "../../store/store";

export const WebSceneView = () => {
  const sceneRef = useRef();
  const [sceneView, setView] = useState(null);
  const [footprintsLayer, setFootprintsLayer] = useState(null);
  const [searchGraphic, setSearchGraphic] = useState(null);
  const [staticFootprintsLayer, setStaticFootprintsLayer] = useState(null);
  const globalState = useContext(store);
  const _basemap = globalState.state.basemap;
  const _searchArea = globalState.state.searchArea;
  // console.log(globalState);
  useEffect(() => {
    // console.log("useEffect1");
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/core/watchUtils",
      ],
      {
        css: true,
      }
    ).then(([ArcGISMap, SceneView, GraphicsLayer, watchUtils]) => {
      const ikonosFootprints = new GraphicsLayer();
      const searchGraphic = new GraphicsLayer();
      setFootprintsLayer(ikonosFootprints);
      setSearchGraphic(searchGraphic);

      const staticIkonosFootprints = new GraphicsLayer();
      setStaticFootprintsLayer(staticIkonosFootprints);

      const map = new ArcGISMap({
        basemap: "satellite",
        ground: "world-elevation",
      });

      // load the map view at the ref's DOM node
      const view = new SceneView({
        container: sceneRef.current,
        map: map,
        scale: 200000000,
        center: [0, 0],
        environment: {
          starsEnabled: true,
          atmosphereEnabled: true,
          lighting: {
            directShadowsEnabled: true,
            date:
              "Mon Apr 06 2020 17:19:18 GMT+0200 (Central European Summer Time)",
          },
        },
      });

      function rotate() {
        if (!view.interacting) {
          if (view.map.layers.length === 0) {
            const camera = view.camera.clone();
            camera.position.longitude += 0.08;
            view.goTo(camera, { animate: false });
            requestAnimationFrame(rotate);
          }
        }
      }

      view.when(function () {
        watchUtils.whenFalseOnce(view, "updating", rotate);
      });

      setView(view);
      return () => {
        if (view) {
          // destroy the map view

          view.container = null;
        }
      };
    });
  }, []);

  useEffect(() => {
    // console.log("useEffect2");
    if (!sceneView) {
      return;
    }
    console.log(globalState.state);
    sceneView.map.basemap = _basemap;
  }, [_basemap]);

  useEffect(() => {
    // console.log("useEffect3");
    if (!sceneView) {
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
      sceneView.map.add(footprintsLayer);
    });

    return () => {
      footprintsLayer.removeAll();
      sceneView.map.remove(footprintsLayer);
    };
  }, [globalState.state.visibleFootprints]);

  useEffect(() => {
    if (sceneView === null) {
      return;
    }
    // console.log("Updated Visible Imagery");

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
      sceneView.map.add(staticFootprintsLayer);
    });
    return () => {
      staticFootprintsLayer.removeAll();
      sceneView.map.remove(staticFootprintsLayer);
    };
  }, [globalState.state.visibleImagery]);

  useEffect(() => {
    if (globalState.state.searchArea === null) {
      return;
    }
    // console.log("useEffect searchArea");
    sceneView.goTo(
      {
        center: [
          _searchArea.geometry.centroid.longitude,
          _searchArea.geometry.centroid.latitude,
        ],
        zoom: 9,
        tilt: 55,
      },
      { duration: 1000 }
    );
    const fillSymbol = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [96, 56, 103, 0.4],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [96, 56, 103],
        width: 2,
      },
    };

    loadModules(["esri/Graphic", "esri/geometry/support/webMercatorUtils"], {
      css: true,
    }).then(([Graphic, webMercatorUtils]) => {
      let wgs84Rings = _searchArea.geometry.rings[0].map((coord) => {
        // console.log(coord);
        return webMercatorUtils.xyToLngLat(coord[0], coord[1]);
      });
      const _searchGraphic = new Graphic({
        geometry: {
          type: "polygon", // autocasts as new Polygon()
          rings: wgs84Rings,
        },
        symbol: fillSymbol,
      });

      searchGraphic.removeAll();
      searchGraphic.add(_searchGraphic);
      sceneView.map.add(searchGraphic);
    });
    return () => {
      searchGraphic.removeAll();
      sceneView.map.remove(searchGraphic);
    };
  }, [_searchArea]);

  return <div style={{ height: "100%", width: "100%" }} ref={sceneRef} />;
};
