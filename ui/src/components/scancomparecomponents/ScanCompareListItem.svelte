<script>
  import { createEventDispatcher, onMount } from "svelte";
  export let value;
  export let comparisonDifferences = {};

  const dispatch = createEventDispatcher();
  const getBrokenLinkDetails = () => dispatch('getBrokenLinkDetails', { runId: value.runId });
  
  onMount(() => {
    getBrokenLinkDetails();
  })
  
  $: value, getBrokenLinkDetails();

  function numberWithCommas(x) {
    if (x) {
      return x.toLocaleString();
    }
    return x
  }
</script>

<div class="grid grid-cols-2 grid-rows-2 text-start font-sans font-bold my-4">
  <div
    class:textred={value.uniqueBrokenLinks > 0}
    class:textgrey={value.uniqueBrokenLinks === 0}
  >
    <i class="fas fa-link-slash textred text-3xl"/>
    <span class="text-4xl">{value.uniqueBrokenLinks}</span>
  </div>
  <div class="text-right my-auto">
    {#if Object.keys(comparisonDifferences).length > 0}
    <i class="textgrey fas {comparisonDifferences.brokenLinksDifference > 0 ? "fa-arrow-up" : comparisonDifferences.brokenLinksDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
    <span class="textgrey">{numberWithCommas(Math.abs(comparisonDifferences.brokenLinksDifference))}</span>
    {/if}
  </div>
  <h3 class="col-span-2 font-bold font-sans textgrey">Broken Links</h3>
</div>

<div class="grid grid-cols-2 grid-rows-2 text-start font-sans font-bold my-4">
  <div class="textred">
    <i class="fas fa-exclamation-circle textred text-3xl"/>
    <span class="text-4xl">{numberWithCommas(value.htmlErrors)}</span>
  </div>
  <div class="text-right my-auto">
    {#if Object.keys(comparisonDifferences).length > 0}
    <i class="textgrey fas {comparisonDifferences.codeErrorDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeErrorDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
    <span class="textgrey">{numberWithCommas(Math.abs(comparisonDifferences.codeErrorDifference))}</span>
    {/if}
  </div>
  <h3 class="col-span-2 font-bold font-sans textgrey">HTML Errors</h3>
</div>

<div class="grid grid-cols-2 grid-rows-2 text-start font-sans font-bold my-4">
  <div class="text-yellow-600">
    <i class="fas fa-exclamation-triangle text-3xl" style="color: #d69e2e" />
    <span class="text-4xl">{numberWithCommas(value.htmlWarnings)}</span>
  </div>
  <div class="text-right my-auto">
    {#if Object.keys(comparisonDifferences).length > 0}
      <i class="textgrey fas {comparisonDifferences.codeWarningDifference > 0 ? "fa-arrow-up" : comparisonDifferences.codeWarningDifference === 0 ? "fa-arrow-right" : "fa-arrow-down"}"/>
      <span class="textgrey">{numberWithCommas(Math.abs(comparisonDifferences.codeWarningDifference))}</span>
    {/if}
  </div>
  <h3 class="col-span-2 font-bold font-sans textgrey">HTML Warnings</h3>
</div>
