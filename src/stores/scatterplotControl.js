import { writable, derived } from "svelte/store";

export const scatterplotXvar = writable("scl_pct_nonwhite");

export const scatterplotYvar = writable("median_gross_rent");

/*
 * an object of arrays where [0] is the label name and [1] is the variable name
 */
export let housingIndicatorsData = [
  {dropTitle: "Median rent", chartTitle: "Median Rent", var: "median_gross_rent"},
  {dropTitle: "Median mortgage", chartTitle: "Median Mortgage", var: "median_owner_cost_mortgage"},
  {dropTitle: "Homeowner share", chartTitle: "Homeowner Share", var: "percent_owner_occupied"},
  {dropTitle: "Renter share", chartTitle: "Renter Share", var: "percent_renter_occupied"},
  {dropTitle: "Single-family zoning", chartTitle: "Single-Family Zoning", var: "test_sfh_pct"},
  {dropTitle: "School-age residents of color", chartTitle: "School-Age Residents of Color", var: "tract_pct_nonwhite"},
];

export const activeLabel = derived(scatterplotYvar, ($scatterplotYvar) => {
  return housingIndicatorsData.filter(d=> d.var == $scatterplotYvar)[0].dropTitle
});

export const activeTitle = derived(scatterplotYvar, ($scatterplotYvar) => {
  return housingIndicatorsData.filter(d=> d.var == $scatterplotYvar)[0].chartTitle
});

export let activeFormat = derived(scatterplotYvar, ($scatterplotYvar) => {
  let format;
  switch ($scatterplotYvar) {
    case "median_gross_rent": format = new Intl.NumberFormat('en-US',{style: "currency", currency: "USD", maximumFractionDigits: 0}); break;
    case "median_owner_cost_mortgage": format = new Intl.NumberFormat('en-US',{style: "currency", currency: "USD", maximumFractionDigits: 0}); break;
    case "percent_owner_occupied": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "percent_renter_occupied": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "test_sfh_pct": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    case "tract_pct_nonwhite": format = new Intl.NumberFormat('en-US',{style: "percent"}); break;
    default: format = new Intl.NumberFormat('en-US',{style: "percent"}); ;
  }
  return format;
})

export const takeawaysText = derived(scatterplotYvar, ($scatterplotYvar) => {
  let val = [];
  switch ($scatterplotYvar) {
    case "median_gross_rent":
      val = [
        `The share of students of color who attend public schools is lower in
        areas with high rents. Of the 35 Charlotte schools located in neighborhoods with median rents
        higher than the average rent for a family of four in the Charlotte area ($1,554), 15 schools have a
        greater share of white students than Charlotte has white residents.`,
        `In areas with higher rents, families are more likely to opt out of their
        public school. Whereas 67 percent of children living in areas with the lowest rent attend public
        schools, 61 percent do in the highest-rent neighborhoods. In fact, 30 of Charlotte’s 35 schools in
        high-rent areas enroll a disproportionate share of students of color compared with the local
        population.`,
      ];
      break;
    case "median_owner_cost_mortgage":
      val = [
        `As homeownership costs increase, the share of students of color who attend public
        schools decreases. The median cost of owning a home in Charlotte is $1,666 a month. Of the 120
        schools in communities with lower median costs, 110 have a share of white students less than
        Charlotte’s share of white residents.`,
        `Only 55 percent of students in Charlotte’s highest-mortgage-cost areas
        attend public schools, meaning higher mortgage costs lead fewer students to enroll in public
        schools. Of the 57 schools in areas with mortgage costs higher than the North Carolina median,
        53 enroll a disproportionate share of white students.`,
      ];
      break;
    case "percent_owner_occupied":
      val = [
        `The average share of white students is five times higher in communities with the highest homeownership rates than in communities with the lowest rates. In Charlotte neighborhoods with the most homeowners, 57 percent of students are white. Because of a <a href="https://ui.charlotte.edu/story/home-ownership-and-legacy-redlining" target="_blank">history of redlining and neighborhood segregation</a>, white families in Charlotte are more likely to own a home than Black or Latinx families, which perpetuates school segregation.`,
        `In areas with the highest share of homeowners, 75 percent of white households attend public schools, compared with 33 percent of white families attending public schools in areas with the lowest levels of owner occupancy. In areas with lower homeownership rates, white families tend to opt out of public schools.`,
      ];
      break;
    case "percent_renter_occupied":
      val = [
        `In Charlotte neighborhoods where most families rent, schools tend to enroll more students of color. Of the 76 schools in tracts where most units are renter-occupied units, 55 schools enroll 80 percent or more students of color. Previous research shows that even in high-performing districts with many rental units, families with lower incomes may be locked out because of <a href="https://housingmatters.urban.org/feature/why-schools-should-care-about-housing-voucher-discrimination" target="_blank">housing voucher discrimination.</a>`,
        `In communities where most families rent, 64 percent of school-age residents attend public schools. Only 17 percent of students are white in high-renter-occupancy neighborhoods, whereas the neighborhoods with the least renters have 44 percent of white students.`,
      ];
      break;
    case "test_sfh_pct":
      val = [
        `Areas with single-family zoning allow only for residences that house a single family to be built, effectively banning duplexes and apartment buildings. By limiting building types, <a href="https://apps.urban.org/features/advancing-equity-affordability-through-zoning/" target="_blank">zoning laws can enforce segregation</a> and prevent residents with lower incomes from accessing opportunities, like high-achieving public schools. Of Charlotte schools located in a census tract where more than 70 percent of land is zoned for single-family homes, 53 percent have a greater share of white residents than the share of white residents in Charlotte.`,
        `As the share of tracts that are zoned for single-family housing increases, the share of white students attending public schools increases. Of the 77 schools in census tracts where more than 70 percent of the land is zoned for single-family homes, 66 schools educate a greater share of students of color than the tract’s share of residents of color, indicating that many white families do not attend public schools.`,
      ];
      break;
    case "tract_pct_nonwhite":
      val = [
        `Charlotte’s school segregation mirrors its neighborhood segregation. There are many neighborhoods with nearly all residents of color but few neighborhoods with exclusively white residents. In some cases, school boundaries reinforce neighborhood segregation, with <a href="https://apps.urban.org/features/dividing-lines-school-segregation/" target="_blank">13 pairs of neighboring schools</a> in Charlotte vastly different in terms of residents’ racial and ethnic composition on either side of the boundary.`,
        `In Charlotte, 48 percent of white children opt out of public schools: they are homeschooled, enrolled in private schools, or enrolled in charter schools. Like many communities, <a href="https://www.urban.org/data-tools/segregated-neighborhoods-segregated-schools" target="_blank">schools in Charlotte are more segregated than neighborhoods</a> because white families tend to opt out of neighborhood schools. `,
      ];
      break;
    default:
      val = ["no text here", "no text there"];
  }
  return val;
});

export const takeawaysTitles = derived(scatterplotYvar, ($scatterplotYvar) => {
  let val = [];
  switch ($scatterplotYvar) {
    case "median_gross_rent":
      val = ["Higher-Than-Average Rent", "67% Public School Share"];
      break;
    case "median_owner_cost_mortgage":
      val = ["110 Schools", "55% Public School Share"];
      break;
    case "percent_owner_occupied":
      val = ["Ownership Effect", "57% White"];
      break;
    case "percent_renter_occupied":
      val = ["55 Schools", "64% Public School Share"];
      break;
    case "test_sfh_pct":
      val = ["Zoning Limitations", "66 Schools"];
      break;
    case "tract_pct_nonwhite":
      val = ["Residential Segregation", "White Resident Opt-Out"];
      break;
    default:
      val = ["no text here", "no text there"];
  }
  return val;
});

export let housingVar = writable("median_gross_rent");
