<script>
  import CodeSummary from "./CodeSummary.svelte";
  import LinkSummary from "./LinkSummary.svelte";
  import LighthouseSummary from "./LighthouseSummary.svelte"; 
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { printTimeDiff } from "../utils/utils";
  export let value = {};
  export let url;
  </script>

  <div>
      {#each value as val}
      <div class="flex mb-4">
        <div class="w-1/4 h-12">
            <span class="text-start font-sans font-bold">{url}</span>
            <br>
      <div class="font-sans text-sm pt-2">
        Last scanned {formatDistanceToNow(new Date(val.buildDate), {
          addSuffix: true
        })}
        <span class="font-sans font-bold">{printTimeDiff(+val.scanDuration)}</span>
      </div>
        </div>
        <div class="w-1/4 h-12">
            <LinkSummary value={val} />
        </div>
        <div class="w-1/4 h-12">
            <CodeSummary value={val} />
        </div>
        <div class="w-1/4 h-12">
            <LighthouseSummary value={val} />
        </div>
        
      </div>
      {/each}
  </div>
