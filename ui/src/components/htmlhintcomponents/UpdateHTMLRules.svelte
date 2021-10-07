<script>
  import Toastr from "../misccomponents/Toastr.svelte";
  import { CONSTS, htmlHintRules, customHtmlHintRules } from "../../utils/utils";
  import Modal from "../misccomponents//Modal.svelte";
  import LoadingFlat from "../misccomponents/LoadingFlat.svelte";
  
  export let url;
  export let show;
  export let loading;
  export let user;

  let saving;
  let addedSuccess;
  let addedFail;

	let selection = [];

  const dismiss = () => (show = false);

  const updateIgnore = async () => {
    const selectedRules = selection.toString()
    saving = true;
    if (selection.length > 0) {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules`,
        {
          method: "PUT",
          body: JSON.stringify({
            url,
            selectedRules,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (res.ok) {
        saving = false;
        show = false;
        addedSuccess = true;
      } else {
        throw new Error("Failed to load");
      }
    } else {
      addedFail = true;
      saving = false
    }
  };
  
</script>

<Modal
  bind:show
  bind:loading={saving}
  header="Enabled Rules:"
  mainAction="Save"
  on:action={updateIgnore}
  on:dismiss={dismiss}>
  {#if loading}
    <LoadingFlat />
  {:else}
    <!-- else content here -->
    <h3 class="font-bold">HTML Hint Rules: </h3>
    {#each htmlHintRules as rule}
      <label>
        <input type="checkbox" bind:group={selection} value={rule.rule} /> 
          <a 
          class="inline-block align-baseline link" 
          href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">
            {rule.displayName}
          </a>
      </label>
    {/each}
    <br />
    <h3 class="font-bold">Custom HTML Rules: </h3>
    {#each customHtmlHintRules as rule}
      <label>
        <input type="checkbox" bind:group={selection} value={rule.rule} /> 
          <a 
          class="{rule.ruleLink ? 'link' : 'hover:no-underline cursor-text'} inline-block align-baseline" 
          href={rule.ruleLink}>
            {rule.displayName}
          </a>
      </label>
    {/each}
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">HTML Rules updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>

<Toastr bind:show={addedFail}>
  <p class="font-bold">Please select at least one rule to check</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
