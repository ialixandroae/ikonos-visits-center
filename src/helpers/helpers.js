const getFormattedBasemapName = (basemapName) => {
  switch (basemapName) {
    case "Imagery":
      return "satellite";
    case "Imagery Hybrid":
      return "hybrid";
    case "Streets":
      return "streets";
    case "Topographic":
      return "topo";
    case "Navigation":
      return "streets-navigation-vector";
    case "Streets (Night)":
      return "streets-night-vector";
    case "Terrain with Labels":
      return "terrain";
    case "Light Gray Canvas":
      return "gray";
    case "Dark Gray Canvas":
      return "dark-gray	";
    case "Oceans":
      return "oceans";
    case "National Geographic Style Map":
      return "national-geographic";
    case "OpenStreetMap":
      return "osm";
    default:
      return "topo";
  }
};

const getFootprints = async (baseURL, payload) => {
  const data = await fetch(`${baseURL}/ordering/api/v1/ikonos/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return data.json();
};

export { getFormattedBasemapName, getFootprints };
