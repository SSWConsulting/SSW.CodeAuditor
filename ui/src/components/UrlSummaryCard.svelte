<script>
  import { printTimeDiff } from "../utils/utils";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { Navigate, navigateTo } from "svelte-router-spa";
  export let value = {};
  export let url;

  if (url.length > 60) {
    url = url.slice(0, 60).concat("....");
  }
</script>

<div on:click={() => navigateTo(`/build/${value[0].runId}`)}>
  <p title={url} class="font-sans font-bold text-gray-800 underline">{url}</p>
  <div class="font-sans text-sm pt-2">
    Last scanned
    {formatDistanceToNow(new Date(value[0].buildDate), { addSuffix: true })}
    &#8287 ⌚
    {printTimeDiff(+value[0].scanDuration)}
  </div>
</div>
