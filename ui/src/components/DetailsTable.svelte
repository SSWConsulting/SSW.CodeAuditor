<script>
  import { groupBy, props } from "ramda";
  export let builds = [];
  let sources;
  let destinations;
  let sourcesKeys = [];
  let destinationsKeys = [];
  let displayMode = "s";

  $: if (builds.length > 0) {
    sources = groupBy(props(["src"]))(builds);
    sourcesKeys = Object.keys(sources);
    destinations = groupBy(props(["dst"]))(builds);
    destinationsKeys = Object.keys(destinations);
  }
</script>

<style>
  .active {
    background: white;
    border-radius: 9999px;
    color: #63b3ed;
  }
</style>

{#if builds.length === 0}
  <div class="md:flex md:items-center mb-6">
    There is no broken links in this build!!
  </div>
{:else}
  <div class="mb-4 mx-auto">
    <div
      class="bg-gray-200 text-sm text-gray-500 leading-none border-2
      border-gray-200 rounded-full inline-flex">
      <button
        on:click={() => (displayMode = 's')}
        class:active={displayMode === 's'}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-l-full px-4 py-2">
        <span>By Source</span>
      </button>
      <button
        on:click={() => (displayMode = 'd')}
        class:active={displayMode === 'd'}
        class="inline-flex items-center transition-colors duration-300 ease-in
        focus:outline-none hover:text-blue-400 focus:text-blue-400
        rounded-r-full px-4 py-2">
        <span>By Destination</span>
      </button>
    </div>

  </div>
  {#if displayMode === 's'}
    {#each sourcesKeys as url}
      <div class="mb-3">
        <span class="font-bold mr-2">>> Broken links on:</span>
        <a
          class="inline-block align-baseline text-blue-600 hover:text-blue-800"
          target="_blank"
          href={url}>
          {url}
        </a>
      </div>
      <table class="table-auto mb-8">
        <thead>
          <tr>
            <th class="w-6/12 px-4 py-2">Broken Link</th>
            <th class="w-3/12 px-4 py-2">Anchor Text</th>
            <th class="w-1/12 px-4 py-2 text-right">Status</th>
            <th class="w-2/12 px-4 py-2 text-right">Message</th>
          </tr>
        </thead>
        <tbody>
          {#each sources[url] as val}
            <tr>
              <td class="w-6/12 border px-4 py-2 break-all">
                <a
                  class="inline-block align-baseline text-blue-600
                  hover:text-blue-800"
                  target="_blank"
                  href={val.dst || ''}>
                  {val.dst || ''}
                </a>
              </td>
              <td class="w-3/12 border px-4 py-2 break-all">
                {val.link || ''}
              </td>
              <td class="w-1/12 border px-4 py-2 text-right">
                {val.statuscode || '0'}
              </td>
              <td class="w-2/12 border px-4 py-2 text-right">
                {val.statusmsg || ''}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
  {:else}
    {#each destinationsKeys as url}
      <div class="mb-3">
        <span class="font-bold mr-2">>> Broken Link:</span>
        <a
          class="inline-block align-baseline text-blue-600 hover:text-blue-800"
          target="_blank"
          href={url}>
          {url}
        </a>
      </div>
      <table class="table-auto mb-8">
        <thead>
          <tr>
            <th class="w-6/12 px-4 py-2">Found on Page</th>
            <th class="w-3/12 px-4 py-2">Anchor Text</th>
            <th class="w-1/12 px-4 py-2 text-right">Status</th>
            <th class="w-2/12 px-4 py-2 text-right">Message</th>
          </tr>
        </thead>
        <tbody>
          {#each destinations[url] as val}
            <tr>
              <td class="w-6/12 border px-4 py-2 break-all">
                <a
                  class="inline-block align-baseline text-blue-600
                  hover:text-blue-800"
                  target="_blank"
                  href={val.src || ''}>
                  {val.src || ''}
                </a>
              </td>
              <td class="w-3/12 border px-4 py-2 break-all">
                {val.link || ''}
              </td>
              <td class="w-1/12 border px-4 py-2 text-right">
                {val.statuscode || '0'}
              </td>
              <td class="w-2/12 border px-4 py-2 text-right">
                {val.statusmsg || ''}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/each}
  {/if}
{/if}
