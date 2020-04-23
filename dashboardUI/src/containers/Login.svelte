<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import { createEventDispatcher } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import TextField from "../components/TextField.svelte";

  const loginGmail = () => {
    serverError = "";
    return firebase
      .auth()
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then(x => {})
      .catch(err => {
        console.log(err);
        serverError = err.message;
      });
  };

  const loginEmailPassword = () => {
    serverError = "";
    return firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(x => {})
      .catch(err => {
        console.log(err);
        serverError = err.message;
      });
  };

  let serverError;
  let username;
  let password;
  $: valid = !!username && !!password;
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
        on:click|preventDefault={loginGmail}
        type="button"
        class="bg-red-700 hover:bg-blue-500 text-white font-semibold
        hover:text-grey-100 py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        Sign In Using Google
      </button>
    </div>
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField bind:value={username} label="User Name" type="email" />
    </div>
    <div class="mb-6">
      <TextField
        on:keydown={event => {
          console.log(event);
        }}
        bind:value={password}
        placeholder=""
        label="Password"
        type="password" />
    </div>
    {#if serverError}
      <div class="mb-6">
        <p class="py-4 text-red-500 text-base">{serverError}</p>
      </div>
    {/if}
    <div class="flex items-center justify-between">
      <button
        on:click|preventDefault={loginEmailPassword}
        type="button"
        disabled={!valid}
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
