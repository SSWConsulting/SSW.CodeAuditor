<script>
  export let value = {};

  function numberWithCommas(x) {
    return Math.round(x).toLocaleString()
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 text-center text-lg">
  <div class="col-span-1">
    <span class="block font-sans">Latency P95</span>
    <span
      class="font-sans font-bold block lg:inline-block">{numberWithCommas(value.latencyP95 === undefined ? '0' : value.latencyP95)}ms
    </span>
  </div>
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">Requests</span>
    <span class="font-sans font-bold block lg:inline-block">
      {numberWithCommas(value.requestsCompleted)}
    </span>
  </div>
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">Errors</span>
    <span 
      class="font-sans font-bold block lg:inline-block"
      class:text-red-600={value.errors > 0}
      class:textgrey={value.errors == 0}
    >
      {numberWithCommas(value.errors)} 
      {#if value.errors === 0}
        <i class="fas fa-check"></i>
      {/if}
    </span>
  </div>
</div>
