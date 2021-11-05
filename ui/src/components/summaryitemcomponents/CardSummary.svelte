<script>
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { createEventDispatcher } from "svelte";

  export let value;
  export let isHtmlHintComp;

  const dispatch = createEventDispatcher();
  const htmlHintThreshold = () => dispatch("htmlHintThreshold");

</script>

<div class="hidden md:grid grid-cols-3">
  <div></div>
  <div>
    <div class="text-center">
      <a
        href={value.url}
        target="_blank"
        class="underline text-2xl font-sans font-bold text-gray-800 hover:text-red-600">{value.url}</a>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block text-gray-600">Last
        scanned:
        {formatDistanceToNow(new Date(value.buildDate), { addSuffix: true })}
        at
        {format(new Date(value.buildDate), 'hh:mma')}</span>
    </div>
    <div class="text-center">
      <span
        class="text-2xl font-sans font-bold text-gray-800">{format(new Date(value.buildDate), 'dd.MM.yyyy')}</span>
    </div>
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
