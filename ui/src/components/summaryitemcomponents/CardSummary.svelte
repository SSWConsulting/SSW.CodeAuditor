<script>
  import { format } from "date-fns";
  import formatDistanceToNow from "date-fns/formatDistanceToNow";
  import { createEventDispatcher } from "svelte";
  import { printTimeDiff, convertSpecialCharUrl } from "../../utils/utils";
  import SendAlertModal from "../misccomponents/SendAlertModal.svelte";
  import { userSession$, isLoggedIn } from "../../stores";
  import { CONSTS } from "../../utils/utils";
  import { navigateTo } from "svelte-router-spa";
  import { onDestroy } from "svelte";

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

  const emailAlertModal = async () => {
    let fullUrl = convertSpecialCharUrl(value.url)
    const res = await fetch(`${CONSTS.API}/api/getalertemailaddresses/${userApiKey}/${fullUrl}`);
    sharedEmailAddresses = await res.json();
    showShareAlert = true;
  };

  const navigateToLatestScan = () => {
    navigateTo(`/build/${previousScans[0].runId}`);
    // Force reload page otherwise Svelte would not refresh the content
    location.reload(true);
  }

  const getPreviousScans = async () => {
    let fullUrl = convertSpecialCharUrl(value.url)
    const res = await fetch(`${CONSTS.API}/api/scanSummaryFromUrl/${userApiKey}/${fullUrl}`);
    previousScans = await res.json();
  };

  const userSubscriber = userSession$.subscribe(x => {
    if (x) {
      userApiKey = x.apiKey;
      getPreviousScans();
    }
  });

  onDestroy(userSubscriber);
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
      <span class="text-xl font-sans block lg:inline-block textgrey"> Scanned on:
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
  <div class="text-center my-3">
    {#if previousScans.length > 1}
      {#if previousScans[0].runId !== value.runId}
        <button 
          type="button"
          class="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 border rounded"
          on:click={() => navigateToLatestScan()}
        >
          <i class="fas fa-rocket"></i> Go to latest scan
        </button>
      {/if}
      <button 
        type="button"
        class="bg-white hover:bg-gray-800 hover:text-white font-semibold py-2 px-4 border rounded"
        on:click={navigateTo(`/scanCompare/${value.apiKey || value.partitionKey}/${convertSpecialCharUrl(value.url)}/${value.buildDate}`)}
      >
        <i class="fas fa-code-compare"></i> 
        {previousScans[0].runId !== value.runId ? "Compare to latest scan" : "Compare to previous scan"}
      </button>
    {/if}
    {#if $isLoggedIn}
      <button
        on:click={emailAlertModal} 
        class="bg-white hover:bg-gray-800 hover:text-white font-semibold py-2 px-4 border rounded"
      >
        <i class="fas fa-paper-plane"></i> Send Email Alerts
      </button>
    {/if}
  </div>
  <div class="text-center lg:text-right">
    {#if (value.buildDate && isHtmlHintComp && $isLoggedIn)}
      <button
        on:click={htmlHintThreshold}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
        border hover:border-transparent rounded">
        <span>Enable/Disable Rules</span>
      </button>
    {/if}
    {#if value.buildDate && isLighthouseAudit && $isLoggedIn}
      <button
        on:click={perfThreshold}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
          border hover:border-transparent rounded">
        <span>Set Performance Threshold For Next Scan</span>
      </button>
    {/if}
  </div>
</div>

<SendAlertModal bind:show={showShareAlert} {sharedEmailAddresses} {userApiKey} url={value.url} />
