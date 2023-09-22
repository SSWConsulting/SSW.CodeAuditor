<script>
  import {
    userSession$,
    ignoredUrls$,
    getIgnoreList,
    loadingIgnored$
  } from "../stores";
  import IgnoreLists from "../components/misccomponents/IgnoreLists.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";
  import UpdateIgnoreUrl from "../components/misccomponents/UpdateIgnoreUrl.svelte";

  let ignoreUrlShown;
  let loading = false;

  $: if ($userSession$) {
    load();
  }

  const load = () => {
    loading = true;
    setTimeout(async () => {
      await getIgnoreList($userSession$);
      loading = false;
    }, 300);
  };
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 mb-6 flex flex-col">
    <div class="text-3xl text-center pt-8 pb-6">Ignored URLs</div>
    {#if loading || $loadingIgnored$}
      <LoadingFlat />
    {:else if $userSession$}
      <div class="grid grid-cols-3 gap-4">
        <div>
          <button 
            on:click={() => ignoreUrlShown = true}
            class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4
            border hover:border-transparent rounded">
            <span class="ml-2">Add URLs to Ignore List</span>
          </button>
        </div>
      </div>
      <IgnoreLists builds={$ignoredUrls$} />
    {:else}
      <div class="text-xl text-center pt-8 pb-6">You must be logged in to use this feature</div>
    {/if}
  </div>
</div>

<UpdateIgnoreUrl
  bind:show={ignoreUrlShown}
  user={$userSession$} />