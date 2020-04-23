<script>
  import { userApi } from "../stores";
  import marked from "marked";
  import BuildList from "../components/BuildList.svelte";

  let promise;

  async function getLastBuilds(api) {
    const res = await fetch(
      `https://urlcheckerfunc.azurewebsites.net/api/scanresult/${api}`
    );
    const result = await res.json();

    if (res.ok) {
      return result;
    } else {
      throw new Error("Failed to load");
    }
  }

  userApi.subscribe(x => {
    if (x) {
      promise = getLastBuilds(x);
    }
  });

  const instructions = `
  ## SSW Link Auditor - Setup instructions
  Scan any website for broken links by running the following command:
  \`\`\` bash
  $ docker run nvhoanganh1909/sswlinkauditor --url <YOUR_URL> --token <YOUR_TOKEN>
  \`\`\`
  Where:
  - **YOUR_URL** is the Url you want to scan
  - **YOUR_TOKEN** is your unique token. You can generate [here](/tokens)
  `;
</script>

<div class="container mx-auto">
  {#if $userApi}
    <!-- content here -->
    <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      {#await promise}
        <p>Loading...</p>
      {:then data}
        <BuildList builds={data} />
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    </div>
  {:else}
    <!-- else content here -->
    <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <article class="markdown-body">
        {@html marked(instructions)}
      </article>
    </div>
  {/if}

</div>
