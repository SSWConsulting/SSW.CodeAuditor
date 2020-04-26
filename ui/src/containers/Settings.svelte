<script>
  import { userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import firebase from "firebase/app";
  import BuildList from "../components/BuildList.svelte";
  import IgnoreLists from "../components/IgnoreLists.svelte";
  import LoadingFlat from "../components/LoadingFlat.svelte";

  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let promise;
  let lastBuild;

  async function getLastBuilds(api) {
    const res = await fetch(`${CONSTS.API}/api/config/${api}/ignore`);
    const result = await res.json();
    if (res.ok) {
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  userSession$.subscribe(x => {
    if (x) {
      promise = getLastBuilds(x.apiKey);
    }
  });
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <LoadingFlat />
    {:then data}
      {#if data}
        <IgnoreLists builds={data} />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
