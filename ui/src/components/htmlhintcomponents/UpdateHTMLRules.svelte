<script>
  import Toastr from "../misccomponents/Toastr.svelte";
  import { CONSTS } from "../../utils/utils";
  import Modal from "../misccomponents//Modal.svelte";
  import LoadingFlat from "../misccomponents/LoadingFlat.svelte";
  import slug from "slug";
  
  export let url;
  export let show;
  export let loading;
  export let user;

  let saving;
  let addedSuccess;

	let selection = [];

  const dismiss = () => (show = false);

  const getSelectedRules = async() => {
    await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules/${slug(url)}`).then(
          res => res.json()
        ).then(
          data => console.log(data.selection)
        )
  }

  const updateIgnore = async () => {
    saving = true;
    if (selection.length > 0) {
      const res = await fetch(
        `${CONSTS.API}/api/config/${user.apiKey}/htmlhintrules`,
        {
          method: "PUT",
          body: JSON.stringify({
            url,
            selection,
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
    }
    alert('select something')
  };

  const htmlHintConfig = {
    "language-code-block-require": false,
    "tagname-lowercase": false,
    "attr-lowercase": false,
    "attr-value-double-quotes": false,
    "attr-value-not-empty": false,
    "attr-no-duplication": false,
    "doctype-first": false,
    "tag-pair": false,
    "empty-tag-not-self-closed": false,
    "spec-char-escape": false,
    "id-unique": false,
    "src-not-empty": false,
    "title-require": false,
    "alt-require": false,
    "doctype-html5": false,
    "style-disabled": false,
    "inline-style-disabled": false,
    "inline-script-disabled": false,
    "id-class-ad-disabled": false,
    "href-abs-or-rel": false,
    "attr-unsafe-chars": false,
    "head-script-disabled": false
};
  
  const htmlHintRules = [
     { rule: "tagname-lowercase" },
     { rule: "attr-lowercase" }, 
     { rule: "attr-value-double-quotes" },
     { rule: "attr-value-not-empty" },
     { rule: "attr-no-duplication" },
     { rule: "doctype-first" },
     { rule: "tag-pair" },
     { rule: "empty-tag-not-self-closed" },
     { rule: "spec-char-escape" },
     { rule: "id-unique" },
     { rule: "src-not-empty" },
     { rule: "title-require" },
     { rule: "alt-require" },
     { rule: "doctype-html5" },
     { rule: "style-disabled" },
     { rule: "inline-style-disabled" },
     { rule: "inline-script-disabled" },
     { rule: "id-class-ad-disabled" },
     { rule: "href-abs-or-rel" },
     { rule: "attr-unsafe-chars" },
     { rule: "head-script-disabled" },
  ];
</script>

<Modal
  bind:show
  bind:loading={saving}
  header="Select HTML Rules:"
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
          class="text-blue-700" 
          href="https://htmlhint.com/docs/user-guide/rules/{rule.rule}">
            {rule.rule}
          </a>
      </label>
    {/each}
    <br />
    <h3 class="font-bold">Custom Rules: </h3>
    <label><input type="checkbox" bind:group={selection} value={1} /> language-code-block</label>
    <br/>
    <a 
      class="underline text-blue-700" 
      href="https://github.com/SSWConsulting/SSW.CodeAuditor/blob/main/CONTRIBUTING.md">
      How to add your own Custom Rule
    </a>
  {/if}
</Modal>

<Toastr bind:show={addedSuccess}>
  <p class="font-bold">HTML Rules updated for</p>
  <span class="inline-block align-baseline font-bold text-sm link">
    <a href={url} target="_blank">{url}</a>
  </span>
</Toastr>
