<script>
  export let value = {};

  function numberWithCommas(x) {
    return x.toLocaleString()
  }
</script>

<div class="grid grid-cols-2 lg:grid-cols-3 gap-x-5 text-center text-lg">
  <div class="col-span-1">
    <span class="block font-sans">Scanned</span>
    <span
      class="font-sans font-bold block lg:inline-block">{numberWithCommas(value.totalScanned)}</span>
  </div>
  <div class="col-span-1">
    <span class="block whitespace-nowrap font-sans">
      <i class="textred fas fa-link-slash"></i>
      404 Errors
    </span>
    <span
      class="font-sans font-bold block lg:inline-block"
      class:text-red-600={value.uniqueBrokenLinks > 0}
      class:textgrey={value.uniqueBrokenLinks === 0}>
      {value.uniqueBrokenLinks}
      {#if value.uniqueBrokenLinks === 0}
        <i class="fas fa-check"></i>
      {/if}
    </span>
  </div>
</div>
