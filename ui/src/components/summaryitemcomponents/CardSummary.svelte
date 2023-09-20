<script>
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { createEventDispatcher } from "svelte";
  import { printTimeDiff, convertSpecialCharUrl } from "../../utils/utils";
  import SendAlertModal from "../misccomponents/SendAlertModal.svelte";
  import { userSession$ } from "../../stores";
  import { CONSTS } from "../../utils/utils";
  import { navigateTo } from "svelte-router-spa";
  import { onMount } from "svelte";

  export let value;
  export let isHtmlHintComp = false;
  export let isLighthouseAudit = false;

  let showShareAlert;
  let previousScans = [];
  let sharedEmailAddresses = [];
  let userApiKey;

  const dispatch = createEventDispatcher();
  
  const perfThreshold = () => dispatch("perfThreshold");
  const htmlHintThreshold = () => dispatch("htmlHintThreshold");

  const emailAlertModal = () => {
    userSession$.subscribe(async x => {
      userApiKey = x.apiKey;
      let fullUrl = convertSpecialCharUrl(value.url)
      const res = await fetch(`${CONSTS.API}/api/getalertemailaddresses/${userApiKey}/${fullUrl}`);
      sharedEmailAddresses = await res.json();
      showShareAlert = true;
    });
  };
  
  onMount(async () => {
    // Check if scan has any previous scans
    userSession$.subscribe(async x => {
      if (x) {
        userApiKey = x.apiKey;
        let fullUrl = convertSpecialCharUrl(value.url)
        const res = await fetch(`${CONSTS.API}/api/scanSummaryFromUrl/${userApiKey}/${fullUrl}`);
        previousScans = await res.json();
      }
    });
  })

</script>

<div class="grid grid-cols">
  <div>
    <div class="text-center">
      <a
        href={value.url}
        target="_blank"
        class="underline text-xl font-sans font-bold textdark hover:text-red-600">{value.url}</a>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block textgrey">Last
        scanned: 
        <strong>{format(new Date(value.buildDate), 'dd MMM yyyy')}</strong>
        ({formatDistanceToNow(new Date(value.buildDate), { addSuffix: true })} at {format(new Date(value.buildDate), 'hh:mmaaa')})
      </span>
    </div>
    <div class="text-center">
      <span class="text-xl font-sans block lg:inline-block textgrey">
        Duration: {printTimeDiff(+value.scanDuration)}
      </span>
    </div>
  </div>
  <div class="text-center mt-3">
    {#if previousScans.length > 1}
      <button 
        type="button"
        class="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border rounded"
        on:click={navigateTo(`/scanCompare/${value.partitionKey}/${convertSpecialCharUrl(value.url.slice(12))}/${value.buildDate}`)}
      >
        <i class="fas fa-code-compare"></i> Compare to latest scan
      </button>
    {/if}
    <button
      on:click={emailAlertModal} 
      class="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border rounded"
    >
      <i class="fas fa-paper-plane"></i> Send Email Alerts
    </button>
    {#if value.buildDate && isLighthouseAudit}
    <div class="text-center lg:text-right">
      <button
        on:click={perfThreshold}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
          border hover:border-transparent rounded">
        <span>Set Performance Threshold For Next Scan</span>
      </button>
    </div>
    {/if}
  </div>
  <div class="text-center lg:text-right">
    {#if (value.buildDate && isHtmlHintComp)}
      <button
        on:click={htmlHintThreshold}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
        border hover:border-transparent rounded">
        <span>Enable/Disable Rules</span>
      </button>
  {/if}
  </div>
</div>

<SendAlertModal bind:show={showShareAlert} {sharedEmailAddresses} {userApiKey} url={value.url} />
