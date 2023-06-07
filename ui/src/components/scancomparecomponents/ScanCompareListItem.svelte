<script>
  export let value;
  export let comparisonDifferences = {};

  function numberWithCommas(x) {
    return x.toLocaleString();
  }
</script>

<h2 class="font-bold font-sans text-gray-600 mb-2">LINKS</h2>
<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span
      class="font-sans font-bold block lg:inline-block mt-3"
      class:text-red-600={value.totalUnique404 > 0}
      class:text-gray-600={value.totalUnique404 === 0}
    >
      <span class="text-4xl">{value.totalUnique404}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="fas {comparisonDifferences.brokenLinksDifference > 0 ? "fa-arrow-up" : "fa-arrow-down"}" style="color: #4B5563" />
        <span class="text-gray-600">{Math.abs(comparisonDifferences.brokenLinksDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">404 Errors
      <i class="fas fa-exclamation-circle" style="color: red" />
    </span>
  </div>
</div>

<h2 class="font-bold font-sans text-gray-600 mt-8 mb-2">CODE</h2>
<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span class="font-sans font-bold block lg:inline-block text-yellow-600 mt-3">
      <span class="text-4xl">{numberWithCommas(value.htmlWarnings)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="fas {comparisonDifferences.codeWarningDifference > 0 ? "fa-arrow-up" : "fa-arrow-down"}" style="color: #4B5563" />
        <span class="text-gray-600">{Math.abs(comparisonDifferences.codeWarningDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">HTML Warnings
      <i class="fas fa-exclamation-triangle" style="color: #d69e2e" />
    </span>
  </div>
  <div class="text-start mt-6">
    <span class="font-sans font-bold block lg:inline-block text-red-600">
      <span class="text-4xl">{numberWithCommas(value.htmlErrors)}</span>
      {#if Object.keys(comparisonDifferences).length > 0}
        <i class="fas {comparisonDifferences.codeErrorDifference > 0 ? "fa-arrow-up" : "fa-arrow-down"}" style="color: #4B5563" />
        <span class="text-gray-600">{Math.abs(comparisonDifferences.codeErrorDifference)}</span>
      {/if}
    </span>
    <span class="block whitespace-no-wrap font-sans mt-2">HTML Errors
      <i class="fas fa-exclamation-circle" style="color: red" />
    </span>
  </div>
</div>
