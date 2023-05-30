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
    <span class="block whitespace-no-wrap font-sans"
      >404 Errors
      <i class="fas fa-exclamation-circle" style="color: red" />
    </span>
    <span
      class="font-sans font-bold block lg:inline-block"
      class:text-red-600={value.totalUnique404 > 0}
      class:text-gray-600={value.totalUnique404 === 0}
    >
      {value.totalUnique404}
      {Object.keys(comparisonDifferences).length > 0
        ? `(
        ${comparisonDifferences.brokenLinksDifference > 0 ? "⬆️" : "⬇️"} 
        ${Math.abs(comparisonDifferences.brokenLinksDifference)} )`
        : ""}
    </span>
  </div>
</div>

<h2 class="font-bold font-sans text-gray-600 mt-3 mb-2">CODE</h2>
<div class="grid grid-cols-1 gap-x-5 text-lg">
  <div class="text-start">
    <span class="block font-sans"
      >HTML Warnings
      <i class="fas fa-exclamation-triangle" style="color: #d69e2e" />
    </span>
    <span class="font-sans font-bold block lg:inline-block text-yellow-600"
      >{numberWithCommas(value.htmlWarnings)}
      {Object.keys(comparisonDifferences).length > 0
        ? `(
            ${comparisonDifferences.codeWarningDifference > 0 ? "⬆️" : "⬇️"} 
            ${Math.abs(comparisonDifferences.codeWarningDifference)} )`
        : ""}</span
    >
  </div>
  <div class="text-start mt-2">
    <span class="block whitespace-no-wrap font-sans"
      >HTML Errors
      <i class="fas fa-exclamation-circle" style="color: red" />
    </span>
    <span class="font-sans font-bold block lg:inline-block text-red-600">
      {numberWithCommas(value.htmlErrors)}
      {Object.keys(comparisonDifferences).length > 0
        ? `(
        ${comparisonDifferences.codeErrorDifference > 0 ? "⬆️" : "⬇️"} 
        ${Math.abs(comparisonDifferences.codeErrorDifference)} )`
        : ""}
    </span>
  </div>
</div>
