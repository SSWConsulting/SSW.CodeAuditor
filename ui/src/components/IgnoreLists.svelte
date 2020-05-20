<script>
  import format from "date-fns/format";
  import Toastr from "./Toastr.svelte";
  import LoadingCirle from "./LoadingCirle.svelte";
  import Icon from "./Icon.svelte";
  import { userSession$, deleteIgnoreUrl } from "../stores";

  export let builds = [];

  $: numberOfIgnored = builds.length;

  let addedFailedToast;
  let deleteUrl;
  let loading;
  const deleteIgnore = async (url, user) => {
    deleteUrl = url.urlToIgnore;
    loading = true;
    try {
      await deleteIgnoreUrl(url, user);
    } catch (error) {
      addedFailedToast = true;
    } finally {
      loading = false;
    }
  };
</script>

{#if numberOfIgnored === 0}
  <div class="md:flex md:items-center mb-6">You have 0 ignored URLs!</div>
{:else}
  <table class="table-auto mb-6">
    <thead>
      <tr>
        <th class="px-4 py-2">Ignored Url</th>
        <th class="px-4 py-2">Apply To</th>
        <th class="px-4 py-2">Duration</th>
        <th class="px-4 py-2">From</th>
        <th class="px-4 py-2" />
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-middle link"
              target="_blank"
              href={val.urlToIgnore}>
              {val.urlToIgnore}
            </a>
          </td>
          <td class="border px-4 py-2">
            {#if val.ignoreOn === 'all'}
              On all scans
            {:else}
              When scanning
              <a
                class="inline-block align-middle link"
                target="_blank"
                href={val.ignoreOn}>
                {val.ignoreOn}
              </a>
            {/if}
          </td>
          <td class="border px-4 py-2 text-center">
            {#if val.ignoreDuration === -1}
              <span>Permanently</span>
            {:else}
              <span>For {val.ignoreDuration} days</span>
            {/if}
          </td>
          <td class="border px-4 py-2 text-right">
            {format(new Date(val.effectiveFrom), 'dd/MM/yyyy')}
          </td>
          <td class="border px-4 py-2">
            {#if loading && val.urlToIgnore === deleteUrl}
              <LoadingCirle />
            {:else}
              <a
                href="javascript:void(0)"
                on:click={() => deleteIgnore(val, $userSession$)}>
                <Icon>
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                    01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0
                    00-1 1v3M4 7h16" />
                </Icon>
              </a>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<Toastr bind:show={addedFailedToast}>
  <p class="font-bold">Failure</p>
  <p class="text-sm">
    Failed to remove
    <span class="font-bold">{deleteUrl}</span>
  </p>
</Toastr>
