<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import { createEventDispatcher, onMount } from "svelte";
  import { Navigate } from "svelte-router-spa";
  import TextField from "../components/TextField.svelte";
  import SocialLogin from "../components/SocialLogin.svelte";
  import { oauthLoginError } from "../stores.js";

  let loading;
  const loginEmailPassword = () => {
    serverError = "";
    loading = true;
    return firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .catch(err => (serverError = err.message))
      .finally(() => (loading = false));
  };

  let serverError;
  let username;
  let password;
  $: valid = !!username && !!password;
</script>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-6 mx-auto">
      <svg
        fill="none"
        stroke-linecap="round"
        class="inline-block text-red-600"
        height="35"
        width="35"
        stroke-linejoin="round"
        stroke-width="3"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      <span class="text-3xl align-middle ml-2">SSW LinkAuditor</span>
    </div>
    <SocialLogin bind:serverError />
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField
        bind:value={username}
        label="User Name"
        type="email"
        on:enterKey={loginEmailPassword} />
    </div>
    <div class="mb-6">
      <TextField
        on:enterKey={loginEmailPassword}
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
    {#if $oauthLoginError}
      <div class="mb-6">
        <p class="py-4 text-red-500 text-base">{$oauthLoginError.message}</p>
      </div>
    {/if}
    <div class="flex items-center justify-between">
      <button
        on:click|preventDefault={loginEmailPassword}
        type="button"
        disabled={!valid || loading}
        class="bg-blue-100 hover:bg-blue-500 text-blue-800 font-semibold
        hover:text-white py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        Sign In
        {#if loading}...{/if}
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
