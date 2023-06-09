<script>
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { createEventDispatcher } from "svelte";
  import { printTimeDiff } from "../../utils/utils";
  import { navigateTo } from "svelte-router-spa";
  import { convertSpecialCharUrl } from "../../utils/utils";

  export let value;
  export let isHtmlHintComp;

  const dispatch = createEventDispatcher();
  const htmlHintThreshold = () => dispatch("htmlHintThreshold");

</script>

<div class="hidden md:grid grid-cols">
  <div></div>
  <div>
    <div class="text-center">
      <a
        href={value.url}
        target="_blank"
        class="underline text-xl font-sans font-bold text-gray-800 hover:text-red-600">{value.url}</a>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block text-gray-600">Last
        scanned: 
        <strong>{format(new Date(value.buildDate), 'dd MMM yyyy')}</strong>
        ({formatDistanceToNow(new Date(value.buildDate), { addSuffix: true })} at {format(new Date(value.buildDate), 'hh:mmaaa')})
      </span>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block text-gray-600">
        Duration: {printTimeDiff(+value.scanDuration)}
      </span>
    </div>
  </div>
  <div class="text-center mt-3">
    <button 
      type="button"
      class="w-48 link cursor-pointer border rounded hover:bg-red-600 hover:text-white" 
      on:click={navigateTo(`/scanCompare/${value.partitionKey}/${convertSpecialCharUrl(value.url.slice(12))}/${value.buildDate}`)}
    >
      Compare to latest scan
    </button>
  </div>
  <div class="text-right">
    {#if (value.buildDate && isHtmlHintComp)}
    <button
    on:click={htmlHintThreshold}
    class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
    border hover:border-transparent rounded">
    <span class="ml-2">Enabled Rules</span>
  </button>
  {/if}
  </div>

</div>
