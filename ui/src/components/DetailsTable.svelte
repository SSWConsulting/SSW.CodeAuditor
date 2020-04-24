<script>
  export let builds = [];
  $: numberOfBuilds = builds.length;
</script>

{#if numberOfBuilds === 0}
  <div class="md:flex md:items-center mb-6">
    There is no broken links in this build!!
  </div>
{:else}
  <table class="table-auto mb-6">
    <thead>
      <tr>
        <th class="px-4 py-2">Source</th>
        <th class="px-4 py-2">Destination</th>
        <th class="px-4 py-2">Anchor Text</th>
        <th class="px-4 py-2">Status Code</th>
        <th class="px-4 py-2">Message</th>
      </tr>
    </thead>
    <tbody>
      {#each builds as val}
        <tr>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.src || ''}>
              {val.src || ''}
            </a>
          </td>
          <td class="border px-4 py-2">
            <a
              class="inline-block align-baseline text-blue-600
              hover:text-blue-800"
              target="_blank"
              href={val.dst || ''}>
              {val.dst || ''}
            </a>
          </td>
          <td class="border px-4 py-2">{val.link || ''}</td>
          <td class="border px-4 py-2">{val.statuscode || '0'}</td>
          <td class="border px-4 py-2">{val.statusmsg || ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
