<script>
    import { printTimeDiff } from "../utils/utils";
    import formatDistanceToNow from "date-fns/formatDistanceToNow";
    import { Navigate, navigateTo } from "svelte-router-spa";
    export let value = {};
    export let url;
  
    let filterValue = value.filter(function(values) {
      return values.url == url;
    })
  
  </script>
  
    <div class="text-start" on:click={() => navigateTo(`/build/${filterValue[0].runId}`)}>
      <span class="font-sans font-bold">{url}</span>
      <br>
      <div class="font-sans text-sm pt-2">
        Last scanned {formatDistanceToNow(new Date(filterValue[0].buildDate), {
          addSuffix: true
        })}
        <span class="font-sans font-bold">{printTimeDiff(+filterValue[0].scanDuration)}</span>
      </div>
    </div>
  