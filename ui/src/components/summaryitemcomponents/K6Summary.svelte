<script>
  export let value = {};

  function numberWithCommas(x) {
    return Math.round(x).toLocaleString()
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 text-center text-lg">
  <div class="col-span-1">
    <span class="block font-sans">Count</span>
    <span
      class="font-sans font-bold block lg:inline-block textgrey">{numberWithCommas(value.k6Count)}
    </span>
  </div>
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">Min</span>
    <span class="font-sans font-bold block lg:inline-block textgrey">
      {numberWithCommas(value.k6Min)}ms
    </span>
  </div>
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">Max</span>
    <span class="font-sans font-bold block lg:inline-block textgrey">
      {numberWithCommas(value.k6Max)}ms
    </span>
  </div>
</div>
