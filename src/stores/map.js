import mapboxgl from "mapbox-gl";
//import {scale} from "d3"
import { writable, get } from "svelte/store";
import { currentTract, hoveredTract } from "./currentTract";
import { schoolsInTract, selectedSchoolID } from "./school";
import { CustomControl, getCurrentCoords } from "./customControl";
import school_markers from "../data/school_markers.json"; //parse error if geojson??

import MapMarker from "../lib/components/MapMarker.svelte";
import { logClickToGA } from "$utils/analytics";

let charlotteCenter = [-80.8431, 35.2271],
  charlotteZoom = 9,
  charlotteBbox = [-81.058029, 35.0016161140946, -80.550349, 35.514785]

export const zoomLevelIsCounty = writable(true);
export const zoomLevelNumber = writable(charlotteZoom);

//set breaks to be pulled in for legend
export let colorBreaks = {
  "tract_pct_nonwhite" : [2.5, 24.5, 45.3, 65, 81.7, 98.6],
  "median_gross_rent" : [345, 1014, 1276, 1564, 2267, 3075],
  "median_owner_cost_mortgage" : [746, 1360, 1842, 2413, 3213, 4001],
  "percent_owner_occupied" : [0, .222, .42, .596, .753, 1],
  "percent_renter_occupied" : [0, .209, .395, .577, .768, 1],
  "public_housing_share" : [0, 4, 12, 23.3, 38.5, 72.2]
}

export let colors = ["#73BFE2","#46ABDB","#1696D2","#12719E","#0A4C6A"]

let layerToBeat = "road-label";
let allMarkers = []

let map = null;

let lastStateFeatureId = "";
let mapIsLoaded = false;
let lastClickedTract = "";

function translateBounds(bbox) {
  let box = bbox.split(",");
  return [
    [parseFloat(box[0]), parseFloat(box[1])],
    [parseFloat(box[2]), parseFloat(box[3])],
  ];
}

export function newMapStore(el) {
  let layerVars = [
    "tract_pct_nonwhite",
    "median_gross_rent",
    "median_owner_cost_mortgage",
    "percent_owner_occupied",
    "percent_renter_occupied",
    "public_housing_share",
  ];

  //for hovering -- doesn't matter which layer, as long as it's not a line layer
  //line layer will get the effect of the hover
  let arbitraryFillLayer = "presung-tract-fill-tract_pct_nonwhite";

  let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  function showPopup() {
    // Show the popup at the coordinates with some data
    // @ts-ignore
    popup.trackPointer().addClassName("mapbox-pointer").addTo(map);
  }

  function updatePopup(text) {
    // let stateText = `<span class="popup-name">${
    //   get(hoveredStateData).name
    // }</span><br><span class="popup-value">${get(hoveredStateData).formattedValue}</span>`;
    // let pumaText = get(hoveredPUMA)
    //   ? `<span class="popup-name">${get(hoveredPUMAData).name}<span><br><span class="popup-value">${
    //       get(hoveredPUMAData).formattedValue
    //     }</span>`
    //   : "";
    // let text = pumaText ? pumaText : stateText;
    popup.setHTML(text);
  }

  function hidePopup() {
    popup.remove();
  }

  const customControl = new CustomControl({
    className: "fit-bounds-button",
    title: "Fit to continental US",
    eventHandler: () => {
      resetMap();
    },
  });

  map = new mapboxgl.Map({
    accessToken: "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ",
    container: el,
    style: "mapbox://styles/urbaninstitute/clq4b5k8801ad01qmf861eb0z", //"mapbox://styles/mapbox/streets-v12",
    bounds: charlotteBbox,
    minZoom: charlotteZoom,
    maxZoom: 13,
    antialias: true,
    dragPan: true,
    dragRotate: false, 
    cooperativeGestures: true,
    fitBoundsOptions: {padding: 70}
  })
    .addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right")
    .addControl(customControl, "bottom-right");

  return {
    // return map object
    getMap: function () {
      return map;
    },

    // on load functionality
    onLoad: function () {
      map.on("load", () => {
        map
          .addSource("county-source", {
            type: "geojson",
            data: "./county_shape_alone.geojson", //TODO on staging, change to absolute URL
          })
          .addSource("tract-source", {
            type: "geojson",
            data: "./tract_shapes_alone.geojson",
            promoteId: "id",
          })
          .addSource("marker-source", {
            type: "geojson",
            data: "./school_markers.json",
            promoteId: "ncessch",
          })
          .addLayer(
            {
              id: "presung-tract-fill-tract_pct_nonwhite",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0.7,
                "fill-color": ["case", ["==", ["get", "tract_pct_nonwhite"], null], "#d2d2d2", [
                  "step",
                  ["get", "tract_pct_nonwhite"],
                  colors[0],
                  colorBreaks["tract_pct_nonwhite"][1],
                  colors[1],
                  colorBreaks["tract_pct_nonwhite"][2],
                  colors[2],
                  colorBreaks["tract_pct_nonwhite"][3],
                  colors[3],
                  colorBreaks["tract_pct_nonwhite"][4],
                  colors[4]
                ],],
              },
            },
            layerToBeat
          )
          .addLayer(
            {
              id: "presung-tract-fill-median_gross_rent",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0,
                "fill-color": ["case", ["==", ["get", "median_gross_rent"], null], "#d2d2d2", [
                  "step",
                  ["get", "median_gross_rent"],
                  colors[0],
                  colorBreaks["median_gross_rent"][1],
                  colors[1],
                  colorBreaks["median_gross_rent"][2],
                  colors[2],
                  colorBreaks["median_gross_rent"][3],
                  colors[3],
                  colorBreaks["median_gross_rent"][4],
                  colors[4]
                  
                ],],
              },
            },
            layerToBeat
          )
          .addLayer(
            {
              id: "presung-tract-fill-median_owner_cost_mortgage",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0,
                "fill-color": ["case", ["==", ["get", "median_owner_cost_mortgage"], null], "#d2d2d2", [
                  "step",
                  ["get", "median_owner_cost_mortgage"],
                  colors[0],
                  colorBreaks["median_owner_cost_mortgage"][1],
                  colors[1],
                  colorBreaks["median_owner_cost_mortgage"][2],
                  colors[2],
                  colorBreaks["median_owner_cost_mortgage"][3],
                  colors[3],
                  colorBreaks["median_owner_cost_mortgage"][4],
                  colors[4]
                  
                ],],
              },
            },
            layerToBeat
          )
          .addLayer(
            {
              id: "presung-tract-fill-percent_renter_occupied",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0,
                "fill-color": ["case", ["==", ["get", "percent_renter_occupied"], null], "#d2d2d2", [
                  "step",
                  ["get", "percent_renter_occupied"],
                  colors[0],
                  colorBreaks["percent_renter_occupied"][1],
                  colors[1],
                  colorBreaks["percent_renter_occupied"][2],
                  colors[2],
                  colorBreaks["percent_renter_occupied"][3],
                  colors[3],
                  colorBreaks["percent_renter_occupied"][4],
                  colors[4]
                  
                ],],
              },
            },
            layerToBeat
          )
          .addLayer(
            {
              id: "presung-tract-fill-percent_owner_occupied",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0,
                "fill-color": ["case", ["==", ["get", "percent_owner_occupied"], null], "#d2d2d2", [
                  "step",
                  ["get", "percent_owner_occupied"],
                  colors[0],
                  colorBreaks["percent_owner_occupied"][1],
                  colors[1],
                  colorBreaks["percent_owner_occupied"][2],
                  colors[2],
                  colorBreaks["percent_owner_occupied"][3],
                  colors[3],
                  colorBreaks["percent_owner_occupied"][4],
                  colors[4],
                  
                ],],
              },
            },
            layerToBeat
          )
          .addLayer(
            {
              id: "presung-tract-fill-public_housing_share",
              type: "fill",
              source: "tract-source",
              paint: {
                "fill-outline-color": "#000000",
                "fill-opacity": 0,
                "fill-color": ["case", ["==", ["get", "public_housing_share"], null], "#d2d2d2", [
                  "step",
                  ["get", "public_housing_share"],
                  colors[0],
                  colorBreaks["public_housing_share"][1],
                  colors[1],
                  colorBreaks["public_housing_share"][2],
                  colors[2],
                  colorBreaks["public_housing_share"][3],
                  colors[3],
                  colorBreaks["public_housing_share"][4],
                  colors[4],
                  
                ],],
              },
            },
            layerToBeat
          )
          .addLayer({
            id: "presung-tract-outline",
            type: "line",
            source: "tract-source",
          });

        allMarkers = school_markers.features.map((marker_data) => {
          let mark = document.createElement("div"); //make a markers only div
          let component = new MapMarker({
            target: mark,
            props: { hovered: false, myID: marker_data.properties.ncessch },
          });

          let marker = new mapboxgl.Marker({ element: mark })
            .setLngLat(marker_data.geometry.coordinates)
            .addTo(map);

          mark.addEventListener("click", (e) => {
            setTimeout(() => {
              selectedSchoolID.set(marker_data.properties.ncessch);
            }, 50);
          });

          //POPUP
          mark.addEventListener("mouseenter", showPopup);
          mark.addEventListener("mousemove", (e) => {
            updatePopup(marker_data.properties.school_name);
          });
          mark.addEventListener("mouseleave", hidePopup);

          return marker.getElement();
        });

        // set cool opacity transition
        for (let layer of layerVars) {
          map.setPaintProperty("presung-tract-fill-" + layer, "fill-opacity-transition", {
            duration: 500,
          });
        }

        // set state hover strokes
        map.setLayoutProperty("presung-tract-outline", "visibility", "visible");
        map.setPaintProperty("presung-tract-outline", "line-width", [
          "case",
          ["boolean", ["feature-state", "hoverHighlight"], false],
          3,
          0,
        ]);
        map.setPaintProperty("presung-tract-outline", "line-color", [
          "case",
          ["boolean", ["feature-state", "hoverHighlight"], false],
          "#f9bd30",
          "#000000",
        ]);

        map.setLayoutProperty("poi-label", "visibility", "none");

        mapIsLoaded = true;
      });

      //////* EVENTS *//////
      //analytics
      map.on("click", arbitraryFillLayer, (e) => {
        //remove highlight from last clicked tract
        if (lastClickedTract == e.features[0].properties.id) {
          return;
        }

        if (lastClickedTract) {
          removeOutlineStateHover(lastClickedTract);
        }
        lastClickedTract = e.features[0].properties.id;
        //and reset (already highlighted)
        currentTract.set(e.features[0].properties.id);

        if (get(schoolsInTract).length > 0) {
          selectedSchoolID.set(get(schoolsInTract)[0].ncessch);
        } else {
          selectedSchoolID.set("999999");
        }

        map.fitBounds(translateBounds(e.features[0].properties.bbox), { padding: 35 });

        zoomLevelIsCounty.set(false);
        logClickToGA(
          // @ts-ignore
          el,
          `map_tract_click--${e.features[0].properties.id}`
        );
      });

      map.on("mousemove", arbitraryFillLayer, (e) => {
        let featureId = e.features[0].properties.id;
        hoveredTract.set(featureId);

        // if there is a last state feature and it's not the current feature,
        // set the highlight to false
        if (
          lastStateFeatureId &&
          lastStateFeatureId !== featureId &&
          lastStateFeatureId != lastClickedTract
        ) {
          removeOutlineStateHover(lastStateFeatureId);
        }

        // set the highlight to true for the current feature
        outlineStateHover(get(hoveredTract));

        // at the end of the logic, set the last state feature to the current feature
        lastStateFeatureId = featureId;
      });

      map.on("mouseout", arbitraryFillLayer, (e) => {
        hoveredTract.set(null);
        if (lastStateFeatureId != lastClickedTract) {
          removeOutlineStateHover(lastStateFeatureId);
        }
      });

      // BUTTON
      map.on("zoom", () => {
        if (this.isMapLoaded()) {
          let currentCoords = getCurrentCoords(map);
          if (currentCoords.center == charlotteCenter && currentCoords.zoom == charlotteZoom) {
            customControl.hide();
          } else {
            customControl.show();
          }
          zoomLevelNumber.set(currentCoords.zoom);
        }
      });

      map.on("load", () => {
        if (this.isMapLoaded()) {
          map.resize()
          let currentCoords = getCurrentCoords(map);
          if (currentCoords.center == charlotteCenter && currentCoords.zoom == charlotteZoom) {
            customControl.hide();
          } else {
            customControl.show();
          }
        }
      });
    },

    isMapLoaded: function () {
      return mapIsLoaded;
    },

    //////* LAYERS *//////

    changeActiveLayer: (toggle, options) => {
      if (!mapIsLoaded) return;

      for (let {_, value} of options) {
        map.setPaintProperty(
          "presung-tract-fill-" + value,
          "fill-opacity",
          value === toggle ? 0.7 : 0
        );
      }
    },
  };
}

// set outline state
export function outlineStateHover(tractId) {
  map.setFeatureState(
    {
      source: "tract-source",
      id: tractId,
    },
    { hoverHighlight: true }
  );
}

// remove outline state
export function removeOutlineStateHover(tractId) {
  map.setFeatureState(
    {
      source: "tract-source",
      id: tractId,
    },
    { hoverHighlight: false }
  );
}

export function refreshMap(){
  map.resize();
}

function resetMap() {
  zoomLevelIsCounty.set(true);
  map.fitBounds(charlotteBbox, { padding: 35 });
  zoomLevelNumber.set(charlotteZoom);
}

export function flyToTract(schoolID, tractID) {
  setTimeout(()=>refreshMap(),15);
  if (lastClickedTract) removeOutlineStateHover(lastClickedTract);

  map.jumpTo({ center: charlotteCenter, zoom: charlotteZoom }); //fly to Charlotte to see all tracts

  setTimeout(() => {
    //unfortunately must wait for everything to be in view to query the next tract
    currentTract.set(tractID);
    lastStateFeatureId = tractID;
    lastClickedTract = tractID;
    selectedSchoolID.set(schoolID);
    outlineStateHover(tractID);
    zoomLevelIsCounty.set(false);

    let wantedFeature = map.querySourceFeatures("tract-source", {
      filter: ["==", "id", tractID],
    });
    map.fitBounds(translateBounds(wantedFeature[0].properties.bbox), { padding: 35 });
  }, 25);
  setTimeout(() => {
    zoomLevelNumber.set(map.zoom);
  }, 75)
}

export const mapStore = writable(null);
