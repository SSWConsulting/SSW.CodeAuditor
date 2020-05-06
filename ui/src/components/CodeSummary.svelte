<script>
  export let value = {};
  let otherLangs = [];
  $: cloc = value.cloc ? JSON.parse(value.cloc) : null;
  $: {
    if (cloc) {
      otherLangs = Object.keys(cloc)
        .filter(x => x !== "header")
        .map(x => ({
          name: x,
          ...cloc[x]
        }));

      console.log(otherLangs);
    }
  }
</script>

{#if cloc}
  <!-- content here -->
  <div>
    <div class="grid grid-cols-3 gap-1 row-gap-2">
      <!-- <div class="text-center whitespace-no-wrap">
        <span class="font-mono">Files</span>
        <span class="font-bold inline-block" title="Average">
          {cloc.header.n_files}
        </span>
      </div>
      <div class="text-center whitespace-no-wrap">
        <span class="font-mono">Lines</span>
        <span class="font-bold inline-block" title="Average">
          {cloc.header.n_lines}
        </span>
      </div> -->
      {#each otherLangs as item}
        <div class="text-center whitespace-no-wrap">
          <span class="font-mono text-sm">
            {item.name === 'JavaScript' ? 'JS' : item.name}:
          </span>
          <span
            class="font-bold inline-block"
            title={`${item.comment} files`}>
            {item.code}
          </span>
        </div>
      {/each}
    </div>
  </div>
{/if}
