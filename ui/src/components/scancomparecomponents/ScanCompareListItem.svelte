<script>
  export let value;
  export let comparisonDifferences = {};

  function numberWithCommas(x) {
    return x.toLocaleString();
  }
</script>

<h2 class="font-bold font-sans textgrey mb-2">LINKS</h2>
<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span
      class="font-sans font-bold block lg:inline-block mt-3"
      class:textred={value.totalUnique404 > 0}
      class:textgrey={value.totalUnique404 === 0}
    >
      <span class="text-4xl">{value.totalUnique404}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.brokenLinksDifference > 0 ? "fa-arrow-up" : comparisonDifferences.brokenLinksDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.brokenLinksDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">
      <i class="fas fa-link-slash textred"/>
      404 Errors
    </span>
  </div>
</div>

<h2 class="font-bold font-sans textgrey mt-8 mb-2">CODE</h2>
<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span class="font-sans font-bold block lg:inline-block text-yellow-600 mt-3">
      <span class="text-4xl">{numberWithCommas(value.htmlWarnings)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.codeWarningDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeWarningDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.codeWarningDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">
      <i class="fas fa-exclamation-triangle" style="color: #d69e2e" />
      HTML Warnings
    </span>
  </div>
  <div class="text-start mt-8 mb-4">
    <span class="font-sans font-bold block lg:inline-block textred">
      <span class="text-4xl">{numberWithCommas(value.htmlErrors)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="textgrey fas {comparisonDifferences.codeErrorDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeErrorDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
        <span class="textgrey">{Math.abs(comparisonDifferences.codeErrorDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">
      <i class="fas fa-exclamation-circle textred"/>
      HTML Errors
    </span>
  </div>
</div>
