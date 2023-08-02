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
  export let isHtmlHintComp;

  let showShareAlert;
  let previousScans = [];
  let sharedEmailAddresses = [];
  let userApiKey;

  const dispatch = createEventDispatcher();
  
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
      userApiKey = x.apiKey;
      let fullUrl = convertSpecialCharUrl(value.url)
      const res = await fetch(`${CONSTS.API}/api/scanSummaryFromUrl/${userApiKey}/${fullUrl}`);
      previousScans = await res.json();
    });
  })

</script>

<div class="hidden md:grid grid-cols">
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
  </div>
  <div class="text-right">
    {#if (value.buildDate && isHtmlHintComp)}
      <button
        on:click={htmlHintThreshold}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
        border hover:border-transparent rounded">
        <span class="ml-2">Enable/Disable Rules</span>
      </button>
  {/if}
  </div>
</div>

<SendAlertModal bind:show={showShareAlert} {sharedEmailAddresses} {userApiKey} url={value.url} />
