<script>
  import {
    userSession$,
    ignoredUrls$,
    getIgnoreList,
    loadingIgnored$
  } from "../stores";
  import IgnoreLists from "../components/misccomponents/IgnoreLists.svelte";
  import LoadingFlat from "../components/misccomponents/LoadingFlat.svelte";

  userSession$.subscribe(x => {
    if (x) {
      getIgnoreList(x);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if $loadingIgnored$}
      <LoadingFlat />
    {:else}
      <div class="text-3xl text-center pt-8 pb-6">Ignored URLs</div>
      <IgnoreLists builds={$ignoredUrls$} />
    {/if}
  </div>
</div>
