<script>
  import "../app.css";
  import { getAbsoluteUrl } from "$lib/utils/urls.js";
  import Meta from "$components/Meta/Meta.svelte";
  import PresungMap from "$components/PresungMap.svelte";
  import { setDatavizTitle } from "$utils/analytics";

  // import `pymChild` if this project will be embedded in another site with Pym.js
  import { pymChild } from "$lib/utils/pym.js";
  setDatavizTitle('presung-housing-matters')

  console.log("👋 Welcome to DataViz@URBAN!");

</script>

<Meta
  title="How School Officials and Housing Developers Can Partner to Desegregate Communities | Housing Matters"
  description="Deeply entrenched neighborhood segregation has foiled many school integration efforts,
  with school officials and housing stakeholders often working in silos instead of in partnership."
  social_image={getAbsoluteUrl("social.jpg")}
/>
<main>
  <PresungMap />
</main>

<style>
  main {
    width: 100%;
  }
</style>
