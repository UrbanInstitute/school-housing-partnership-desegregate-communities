<script>
  import { logClickToGA } from "$utils/analytics";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  /**
   * Element ID to scroll to
   * @type {string}
   */
  export let elementId;

  export let text = "Return to top";
</script>

<div
  class="return-top"
  role="button"
  tabindex="0"
  on:click={(e) => {
    dispatch("click", e);
    document.getElementById(elementId)?.scrollIntoView();
    logClickToGA(e.target, "return_to_top--clicked");
  }}
  on:keypress={(e) => {
    dispatch("keypress", e);
    document.getElementById(elementId)?.scrollIntoView();
    logClickToGA(e.target, "return_to_top--clicked");
  }}
>
  <span>{text}</span>
  <svg width="30" height="30" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#fff" />
    <circle cx="20" cy="20" r="17" />
    <path d="m20.264 8.4834 13.052 12.918h-26.103l13.051-12.918z" fill="#fff" />
    <rect x="15.241" y="15.659" width="10.047" height="14.353" fill="#fff" />
  </svg>
</div>

<style>
  .return-top {
    display: flex;
    width: 100%;
    column-gap: 0.375rem;
    align-items: center;
    justify-content:center;
    padding-top: 20px;
    padding-bottom: 20px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
</style>
