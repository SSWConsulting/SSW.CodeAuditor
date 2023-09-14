<script>
  export let cssClass = "";
  export let width = 25;
  export let height = 25;
</script>

<svg
  fill="none"
  {width}
  {height}
  class={cssClass}
  stroke-linecap="round"
  on:click
  on:keydown={undefined}
  stroke-linejoin="round"
  stroke-width="2"
  stroke="currentColor"
  viewBox="0 0 24 24">
  <slot />
</svg>
