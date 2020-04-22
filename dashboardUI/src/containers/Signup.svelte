<script>
  import { createEventDispatcher } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import TextField from "../components/TextField.svelte";

  const signup = () => {
    console.log(username)
  };
  let username;
  let password;
  let confirmpwd;
</script>

<style>

</style>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-4 mx-auto">
      <span class="text-3xl">SSW LinkAuditor</span>
    </div>
    <div class="mb-4">
      <TextField bind:value={username} label="User Name" />
    </div>
    <div class="mb-4">
      <TextField bind:value={password} placeholder="" label="Password" />
    </div>
    <div class="mb-6">
      <TextField
        bind:value={confirmpwd}
        placeholder=""
        label="Confirm Password" />
    </div>
    <div class="flex items-center justify-between">
      <button
        on:click|preventDefault={signup}
        type="button"
        class="bg-blue-100 hover:bg-blue-500 text-blue-800 font-semibold
        hover:text-white py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        Sign up
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue
        hover:text-blue-darker"
        href="/login">
        Already have account?
      </a>
    </div>
  </div>
</form>
