<script>
  export let value = {};
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-x-5">
  <div class="col-span-1 text-start">
    <span class="block font-sans">Latency P95</span>
    <span
      class="font-sans font-bold block lg:inline-block">{value.latencyP95 === undefined ? '0' : value.latencyP95}
    </span>
  </div>
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">Requests</span>
    <span class="font-sans font-bold block lg:inline-block">
      {value.requestsCompleted}
    </span>
  </div>
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">Errors</span>
    <span class="font-sans font-bold block lg:inline-block">
      {value.errors}
    </span>
  </div>
</div>
