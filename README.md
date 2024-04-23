# PRESUNG tool

This is a tool for comparing education and housing parameters and their correlations with each other. 

## Project details

The production URL is [https://housingmatters.urban.org/feature/how-school-officials-and-housing-developers-can-partner-desegregate-communities](https://housingmatters.urban.org/feature/how-school-officials-and-housing-developers-can-partner-desegregate-communities)

Design: Brittney Spinner

Dataviz and Development: Rachel Marconi

Writing: Wes Jenkins

## Data

Data for this project is manipulated in the `joining_school_and_tract_data.Rmd` file. Tile geojsons for the map are generated with `tile_generation.Rmd`.

Data come from several different sources. 

 - The `tigris` package pulls in all tract-level information for Mecklenburg County, NC. 
 - Urban's Education Data Portal feeds two CSV files: `edp_school_data.csv` (all school-level student and teacher data) and `edp_school_race.csv` (just demographic information for the school).
 - Housing-specific information is found and manipulated by the research team, culminating in `Mecklenburg_newVars.csv`: public housing unit totals and public capture shares come from here.
 - Researchers also provide `hudPicture2023_383145.csv`, which is used solely for LIHTC housing totals.
 - Finally, researchers pulled `CMSD_tract_2021.csv` for school-age children race and ethnicity breakdowns.

Our script outputs several CSV files which are [converted](https://csvjson.com/csv2json) to JSON for use in the tool.

 - `school_markers.geojson`: point geometries and identifiers for schools, used to put markers on the map and connect them to school data.
 - `school_race_alone.csv`: translated to json and used to fuel the school half of the race/eth grid charts.
 - `tract_indicators_only.csv`: translated to json and used in `currentTract.js` to connect map-selected tracts to tract census data.
 - `raceeth_kids_in_tract.csv`: translated to json and used fuel the tract half of the race/eth grid charts.
 - `school_indicators_only.csv`: translated to `all_indicators.json` and used to fuel the location of schools on the scatter plot.

## Stores

These files hold global variables that connect and control several components at once, as single sources of truth. 

 - [`activeFrame.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/activeFrame.js): holds whether the Demographics or Takeaways tab is active, for when "view on map" is selected from a scatter plot tooltip and the tab has to change.
 - [`choroplethToggle.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/choroplethToggle.js): holds which map toggle is active in the Demographics tab, controlling which fill layer is visible on the map.
 - [`currentTract.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/currentTract.js): holds which tract is active, controlling the identifier key for data displayed on the left Demographics pane and in grid charts.
 - [`customControl.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/customControl.js): basically a "zoom reset" button for the map, not really a store but kept here.
 - [`map.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/map.js) holds the entire MapBox element and all its connections to zooming, markers, layers, transparency, coloring, and selections.
 - [`scatterplotControl.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/scatterplotControl.js): holds ddifferent label and data formats for the Takeaways tab, as well as all text connected to which housing metric is active. 
 - [`school.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/school.js): holds which school identifier is active, as well as the index that school is in a list of all schools in a tract.
 - [`slider.js`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/stores/slider.js): holds data identifier, max, min, and labels for the double-ranged slider.

## Components

This project makes use of a few [LayerCake](https://layercake.graphics/) components, as well as some internal ToggleGroup components and our team's Analytics component. Otherwise, the components are as follows:

  - [`PresungMap.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/PresungMap.svelte) holds everything

### Demographics
 - left: [`MapInfo.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/MapInfo.svelte)
   - top: [`CharlotteOverallBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/CharlotteOverallBox.svelte), [`NoSchoolBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/NoSchoolBox.svelte), [`SchoolStatsBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/SchoolStatsBox.svelte)
   - middle: [`CharlotteRaceEthBreakdownChartBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/CharlotteRaceEthBreakdownChartBox.svelte) and [`SchoolTractRaceEthBreakdownBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/SchoolTractRaceEthBreakdownBox.svelte)
     - uses [`DotBarChart.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/DotBarChart.svelte) (many [`DotSingleBar.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/DotSingleBar.svelte) items) as chart framework
   - bottom: [`CharlotteHousingUnitsChartBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/CharlotteHousingUnitsChartBox.svelte) and [`TractHousingUnitsChartBox.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/TractHousingUnitsChartBox.svelte)
     - uses [`GridBoxHousingUnits.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/GridBoxHousingUnits.svelte) as chart framework
 - right: [`MapComponent.svelte`](MapComponent.svelte)
   - includes [`Searchbar.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/Searchbar.svelte), [`MapLegend.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/MapLegend.svelte), [`ToggleGroup.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/ToggleGroup.svelte), [`ReturnToTop.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/ReturnToTop.svelte)
  
### Takeaways
 - left: [`Takeaways.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/Takeaways.svelte)
   - includes [`Dropdown.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/Dropdown.svelte) and [`DoubleRangeSlider.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/DoubleRangeSlider.svelte)
 - right: [`ScatterContainer.svelte`](https://github.com/UI-Research/presung-housing-matters/blob/dev/src/lib/components/ScatterContainer.svelte)
   - legend is hardcoded; events for included layercake components live here
