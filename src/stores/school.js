import { writable, derived } from "svelte/store";
import tractData from "../data/all_indicators.json";
import { currentTract } from "./currentTract";

export let selectedSchoolID = writable("999999"); //ncessch of school

export let selectedSchoolData = derived(selectedSchoolID, ($selectedSchoolID) => {
  return $selectedSchoolID == "999999"
    ? []
    : tractData.filter((d) => d.ncessch === parseInt($selectedSchoolID))[0];
});

//returns a list of data object schools in selected tract
export let schoolsInTract = derived(currentTract, ($currentTract) => {
  let group = tractData.filter((d) => d.geoid === $currentTract);

  let schoolArray = [];
  group.map((d) => {
    schoolArray.push(d);
  });

  return schoolArray;
});

export let schoolIndexInTract = derived(
  [schoolsInTract, selectedSchoolID],
  ([$schoolsInTract, $selectedSchoolID]) => {
    return $schoolsInTract.findIndex((d) => d.ncessch == $selectedSchoolID);
  }
); //which number school is this out of whole tract?

export let school_identifiers = tractData.map(({school_name, ncessch, geoid}) => ({school_name, ncessch, geoid}))