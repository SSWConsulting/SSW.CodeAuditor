<script>
  import firebase from "firebase/compat/app";
  import "firebase/compat/auth";
  import "firebase/compat/performance";
  import LoadingCirle from "../components/misccomponents/LoadingCircle.svelte";
  import { navigateTo } from "svelte-router-spa";
  import TextField from "../components/misccomponents/TextField.svelte";
  import SocialLogin from "../components/misccomponents/SocialLogin.svelte";
  import { oauthLoginError } from "../stores.js";
  import { onDestroy, onMount } from "svelte";

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
  let username = "";
  let password = "";
  $: valid = !!username && !!password;

  const perf = firebase.performance();
  let screenTrace

  onMount(() => {
    screenTrace = perf.trace('loginScreen')
    screenTrace.start();
  })

  onDestroy(() => {
    screenTrace.stop();
  })
</script>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-6 mx-auto">
      <span on:click={() => navigateTo('/')} class="align-middle ml-2">
        <img
          class="h-7 object-cover"
          src="https://github.com/SSWConsulting/SSW.CodeAuditor/assets/67776356/6c8b11a5-35cf-469e-a945-57186d0270ef"
          alt="CodeAuditor" />
      </span>
    </div>
    <SocialLogin bind:serverError />
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField
        bind:value={username}
        label="Username"
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
        style={"color: white"}
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4 border
        hover:border-transparent rounded">
        Login
        {#if loading}
          <LoadingCirle />
        {/if}
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue
        hover:text-blue-darker"
        href="/signup">
        Sign Up
      </a>
    </div>
    <div>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue
        hover:text-blue-darker"
        href="/forgetPassword">
        Forgot Password?
      </a>
    </div>
  </div>
</form>
