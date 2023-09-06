<script>
  import { printTimeDiff } from "../../utils/utils";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { navigateTo } from "svelte-router-spa";
  import { tooltip } from "../misccomponents/tooltip";
  export let value = {};
  export let url;

  if (url.length > 60) {
    url = url.slice(0, 60).concat("....");
  }
</script>

<div on:click={() => navigateTo(`/build/${value[0].runId}`)} on:keypress>
  <p title={url} class="font-sans font-bold text-gray-800 underline">{url}</p>
  <div class="font-sans text-sm py-4">
    Last scanned
    {formatDistanceToNow(new Date(value[0].buildDate), { addSuffix: true })}
    <span class="ml-1" title="Scan elapsed time" use:tooltip>🕑</span>
    {printTimeDiff(+value[0].scanDuration)}
  </div>
</div>
