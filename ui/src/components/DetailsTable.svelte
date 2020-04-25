<script>
  import { groupBy, props } from "ramda";
  export let builds = [];
  let sources;
  let destinations;
  let sourcesKeys = [];
  let destinationsKeys = [];
  let displayMode = "s";

  const ignore = url => {};

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
  <div class="my-4 mx-auto">
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
        <span class="font-bold mr-2">>> Found on:</span>
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
                <button
                  title="Ignore this broken link in the next scan"
                  on:click={() => ignore(val.dst)}
                  class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="24"
                    height="24"
                    stroke-width="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0
                      011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0
                      .891-1.077 1.337-1.707.707L5.586 15z"
                      clip-rule="evenodd" />
                    <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                </button>
                <a
                  class="inline-block align-baseline text-blue-600
                  hover:text-blue-800"
                  target="_blank"
                  href={val.dst}>
                  {val.dst}
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
          class="mr-2 inline-block align-baseline text-blue-600 hover:text-blue-800"
          target="_blank"
          href={url}>
          {url}
        </a>
        <button
          title="Ignore this broken link in the next scan"
          on:click={() => ignore(val.dst)}
          class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="24"
            height="24"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0
              011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077
              1.337-1.707.707L5.586 15z"
              clip-rule="evenodd" />
            <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        </button>
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
                  href={val.src}>
                  {val.src}
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
