<script>
  import { userApi, userSession$ } from "../stores";
  import { onDestroy } from "svelte";
  import marked from "marked";
  import Icon from "../components/Icon.svelte";
  import firebase from "firebase/app";
  import BuildList from "../components/BuildList.svelte";
  import LoadingFlat from "../components/LoadingFlat.svelte";

  import { fade, fly } from "svelte/transition";
  import { sort, descend, prop } from "ramda";
  import { CONSTS } from "../utils/utils.js";

  let promise;
  let canClose;
  let lastBuild;

  async function getLastBuilds() {
    const res = await fetch(`${CONSTS.API}/api/scans`);
    const result = await res.json();
    if (res.ok) {
      return sort(descend(prop("buildDate")), result);
    } else {
      throw new Error("Failed to load");
    }
  }

  const instructions = `
  ## Explore CodeAuditor
  Once signed up, you will be able to unlock the following awesome features. All for free!
  `;
</script>

<div class="container mx-auto">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <article class="markdown-body">
      {@html marked(instructions)}
    </article>
  </div>

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#await promise}
      <LoadingFlat />
    {:then data}
      {#if data}
        <BuildList builds={data} {lastBuild} />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
