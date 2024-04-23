<script>
  import { slide } from "svelte/transition";
</script>

<div class="container" transition:slide={{ duration: 0 }}>
  <div class="no-school-text">
    This neighborhood does not include a Charlotte-Mecklenburg public school. Please select another 
    neighborhood to see school data.
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 225px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
  .no-school-text {
    font-size: 16px;
    width: 60%;
  }
</style>
