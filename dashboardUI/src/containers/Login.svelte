<script>
  import { createEventDispatcher } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import TextField from "../components/TextField.svelte";

  const login = () => {};
  let username;
  let password;
</script>

<style>

</style>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-6 mx-auto">
      <span class="text-3xl">SSW LinkAuditor</span>
    </div>
    <div class="mb-4 mx-auto">
      <button
        on:click|preventDefault={login}
        type="button"
        class="bg-red-700 hover:bg-blue-500 text-white font-semibold
        hover:text-grey-100 py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        Sign In Using Google
      </button>
    </div>
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField bind:value={username} label="User Name" />
    </div>
    <div class="mb-6">
      <TextField bind:value={password} placeholder="" label="Password" />
    </div>
    <div class="flex items-center justify-between">
      <button
        on:click|preventDefault={login}
        type="button"
        class="bg-blue-100 hover:bg-blue-500 text-blue-800 font-semibold
        hover:text-white py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        Sign In
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue
        hover:text-blue-darker"
        href="/signup">
        Sign Up
      </a>
    </div>
  </div>
</form>
