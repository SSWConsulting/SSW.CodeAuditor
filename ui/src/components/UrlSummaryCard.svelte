<script>
  import { printTimeDiff } from "../utils/utils";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { Navigate, navigateTo } from "svelte-router-spa";
  export let value = {};
  export let url;
</script>

<div on:click={() => navigateTo(`/build/${value[0].runId}`)}>
  <div class="w-64">
    <p title={url} class="truncate font-sans font-bold text-gray-800 underline">
      {url}
    </p>
  </div>
  <div class="font-sans text-sm pt-2">
    Last scanned
    {formatDistanceToNow(new Date(value[0].buildDate), { addSuffix: true })}
    &#8287 ⌚
    {printTimeDiff(+value[0].scanDuration)}
  </div>
</div>
