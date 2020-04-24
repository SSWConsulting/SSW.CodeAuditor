<script>
  import { userApi } from "../stores";
  import marked from "marked";
  import BuildList from "../components/BuildList.svelte";
  import { fade, fly } from "svelte/transition";

  let promise;
  let showInstruction;
  let canClose;
  async function getLastBuilds(api) {
    const res = await fetch(
      `https://urlcheckerfunc.azurewebsites.net/api/scanresult/${api}`
    );
    const result = await res.json();

    if (res.ok) {
      showInstruction = !result.length;
      canClose = result.length;
      return result;
    } else {
      showInstruction = true;
      throw new Error("Failed to load");
    }
  }

  let token;
  userApi.subscribe(x => {
    if (x) {
      token = x;
      promise = getLastBuilds(x);
    }
  });

  const instructions = `
  ## SSW Link Auditor - Setup instructions
  Scan any website for broken links by running the following command:
  \`\`\` bash
  $ docker run nvhoanganh1909/sswlinkauditor --url <URL> -buildId <BUILDID> --token ${token}
  \`\`\`
  Where:
  - **${token}** is your unique token. You can manage your token [here](/tokens)
  - **BUILDID** (optional) is your CI build number
  `;
</script>

<div class="container mx-auto">
  {#if showInstruction}
    <div
      class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col"
      in:fly={{ y: 100, duration: 400 }}
      out:fade={{ y: -100, duration: 250 }}>
      {#if canClose}
        <a
          class="text-right align-baseline text-sm font-bold text-blue
          hover:text-blue-darker text-2xl"
          on:click={() => (showInstruction = false)}
          href="javascript:void(0)">
          X
        </a>
      {/if}
      <article class="markdown-body">
        {@html marked(instructions)}
      </article>
    </div>
  {/if}

  <div class="bg-white shadow-lg rounded px-8 pt-6 mb-6 flex flex-col">
    {#if !showInstruction}
      <a
        class="text-right align-baseline underline text-sm text-blue font-bold
        hover:text-blue-darker"
        on:click={() => (showInstruction = true)}
        href="javascript:void(0)">
        Show README.md
      </a>
    {/if}
    {#await promise}
      <p class="pb-6 mb-6">Loading...</p>
    {:then data}
      <BuildList builds={data} />
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</div>
