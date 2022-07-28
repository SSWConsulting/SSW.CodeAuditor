<script>
  export let value = {};
  export let brokenLinks = {};

  function numberWithCommas(x) {
    return x.toLocaleString()
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 text-center text-lg">
  <div class="col-span-1 text-start">
    <span class="block font-sans">Scanned</span>
    <span
      class="font-sans font-bold block lg:inline-block">{numberWithCommas(value.totalScanned)}</span>
  </div>
  <div class="col-span-1 text-start">
    <span class="block whitespace-no-wrap font-sans">404 Errors</span>
    <span
      class="font-sans font-bold block lg:inline-block"
      class:text-red-600={value.totalUnique404 > 0}
      class:text-gray-600={value.totalUnique404 === 0}>
      {brokenLinks}
      {#if value.totalUnique404 === 0}
        <i class="fas fa-check"></i>
      {/if}
    </span>
  </div>
</div>
