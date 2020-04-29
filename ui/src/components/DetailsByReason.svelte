<script>
  import { groupBy, props } from "ramda";
  import { isInIgnored } from "../utils/utils.js";
  import { ignoredUrlsList$ } from "../stores.js";
  import { createEventDispatcher } from "svelte";

  export let builds = [];
  const dispatch = createEventDispatcher();
  const ignore = url => dispatch("ignore", url);

  let reasons;
  let reasonsKeys = [];

  $: if (builds.length > 0) {
    reasons = groupBy(props(["statusmsg"]))(builds);
    reasonsKeys = Object.keys(reasons);
  }
  let ignoredPatterns = [];
  ignoredUrlsList$.subscribe(x => (ignoredPatterns = x));
</script>

{#each reasonsKeys as reason}
  <div class="mb-3">
    <span class="font-bold mr-2">
      <svg
        class="inline-block"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        height="20"
        width="20"
        viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
      Failure reason:
    </span>
    <span class="inline-block align-baseline text-blue-600 hover:text-blue-800">
      {reason}
    </span>
  </div>
  <table class="table-auto mb-8">
    <thead>
      <tr>
        <th class="w-4/12 px-4 py-2">Source ({reasons[reason].length})</th>
        <th class="w-5/12 px-4 py-2">Destination</th>
        <th class="w-2/12 px-4 py-2">Anchor Text</th>
        <th class="w-1/12 px-4 py-2 text-right">Status</th>
      </tr>
    </thead>
    <tbody>
      {#each reasons[reason] as val}
        <tr>
          <td class="w-4/12 border px-4 py-2 break-all">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.src}>
              {val.src}
            </a>
          </td>
          <td class="w-5/12 border px-4 py-2">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.dst}>
              {val.dst}
            </a>
            {#if isInIgnored(val.dst, ignoredPatterns)}
              <span
                title="This is URL is in the ignored lists. Go to Settings to
                remove it">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="24"
                  height="24"
                  class="text-red-400 inline-block"
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
              </span>
            {:else}
              <button
                title="Ignore this broken link in the next scan"
                on:click={() => ignore(val.dst)}
                class="hover:bg-gray-400 rounded inline-flex align-middle mr-3">
                <svg
                  fill="none"
                  stroke-linecap="round"
                  width="24"
                  height="24"
                  stroke-linejoin="round"
                  stroke-width="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010
                    12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0
                    011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0
                    .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            {/if}
          </td>
          <td class="w-2/12 border px-4 py-2 break-all">{val.link || ''}</td>
          <td class="w-1/12 border px-4 py-2 text-right">
            {val.statuscode || '0'}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/each}
