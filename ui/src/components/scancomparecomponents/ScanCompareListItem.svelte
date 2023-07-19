<script>
  export let value;
  export let comparisonDifferences = {};

  function numberWithCommas(x) {
    if (x) {
      return x.toLocaleString();
    }
    return x
  }
</script>

<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span
      class="font-sans font-bold block lg:inline-block mt-3"
      class:textred={value.totalUnique404 > 0}
      class:textgrey={value.totalUnique404 === 0}
    >
      <i class="fas fa-link-slash textred text-3xl"/>
      <span class="text-4xl">{value.totalUnique404}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.brokenLinksDifference > 0 ? "fa-arrow-up" : comparisonDifferences.brokenLinksDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.brokenLinksDifference)}</span>
      {/if}
    </span>
    <h3 class="font-bold font-sans textgrey">Broken Links</h3>
  </div>
</div>

<div class="grid grid-cols-1 gap-x-5 text-lg mt-8 mb-2">
  <div class="text-start">
    <span class="font-sans font-bold block lg:inline-block textred">
      <i class="fas fa-exclamation-circle textred text-3xl"/>
      <span class="text-4xl">{numberWithCommas(value.htmlErrors)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.codeErrorDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeErrorDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.codeErrorDifference)}</span>
      {/if}
    </span>
    <h3 class="font-bold font-sans textgrey">HTML Errors</h3>
  </div>
  <div class="text-start mt-8 mb-4">
    <span class="font-sans font-bold block lg:inline-block text-yellow-600">
      <i class="fas fa-exclamation-triangle text-3xl" style="color: #d69e2e" />
      <span class="text-4xl">{numberWithCommas(value.htmlWarnings)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.codeWarningDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeWarningDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.codeWarningDifference)}</span>
      {/if}
    </span>
    <h3 class="font-bold font-sans textgrey">HTML Warnings</h3>
  </div>
</div>
