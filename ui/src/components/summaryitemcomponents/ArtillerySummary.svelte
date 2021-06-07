<script>
  export let value = {};

  function numberWithCommas(x) {
    return Math.round(x).toLocaleString()
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-5">
  <div class="col-span-1 text-start">
    <span class="block font-sans">Latency P95</span>
    <span
      class="font-sans font-bold block lg:inline-block">{numberWithCommas(value.latencyP95 === undefined ? '0' : value.latencyP95)}
    </span>
  </div>
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">Requests</span>
    <span class="font-sans font-bold block lg:inline-block">
      {numberWithCommas(value.requestsCompleted)}
    </span>
  </div>
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">Errors</span>
    <span class="font-sans font-bold block lg:inline-block">
      {numberWithCommas(value.errors)}
    </span>
  </div>
</div>
