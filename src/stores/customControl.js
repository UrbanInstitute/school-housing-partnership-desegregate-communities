export class CustomControl {
  constructor({ className = "", title = "", eventHandler = function () {} }) {
    this._className = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    // create container element and set style/class
    this._container = document.createElement("div");
    this._container.style.display = "none";
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";

    // create button element and set style/class
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon " + this._className;
    this._btn.type = "button";
    this._btn.ariaLabel = "reset map";
    this._btn.ariaDisabled = "false";
    this._btn.onclick = this._eventHandler;

    // create span element and set style/class
    let spanSvg = document.createElement("span");
    spanSvg.classList.add("mapboxgl-ctrl-icon");
    spanSvg.ariaHidden = "true";
    spanSvg.title = "Reset map";
    spanSvg.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><title> fullscreen </title><path fill-rule="evenodd" d="M1 1v6h2V3h4V1H1zm2 12H1v6h6v-2H3v-4zm14 4h-4v2h6v-6h-2v4zm0-16h-4v2h4v4h2V1h-2z"/></svg>')`;

    // append button to span, append span to container
    this._btn.appendChild(spanSvg);
    this._container.appendChild(this._btn);

    // return container
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }

  hide() {
    this._container.style.display = "none";
  }

  show() {
    this._container.style.display = "inline";
  }
}

export const getInitialCoords = (map, usBounds) => {
  let initialCoords = map.cameraForBounds(usBounds);
  initialCoords.zoom = parseFloat(initialCoords.zoom.toFixed(3));
  initialCoords.center.lat = parseFloat(initialCoords.center.lat.toFixed(3));
  initialCoords.center.lng = parseFloat(initialCoords.center.lng.toFixed(3));

  return initialCoords;
};

export const getCurrentCoords = (map) => {
  let currentCoords = {
    center: map.getCenter(),
    zoom: parseFloat(map.getZoom().toFixed(3)),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  };
  currentCoords.center.lat = parseFloat(currentCoords.center.lat.toFixed(3));
  currentCoords.center.lng = parseFloat(currentCoords.center.lng.toFixed(3));

  return currentCoords;
};
