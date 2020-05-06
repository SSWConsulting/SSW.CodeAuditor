<script>
  import { createEventDispatcher } from "svelte";
  import firebase from "firebase/app";
  import Icon from "../components/Icon.svelte";
  import { Navigate, navigateTo } from "svelte-router-spa";
  import TextField from "../components/TextField.svelte";
  import { isValidEmail } from "../utils/utils.js";
  import SocialLogin from "../components/SocialLogin.svelte";
  import LoadingCirle from "../components/LoadingCirle.svelte";

  let loading;
  const signup = () => {
    loading = true;
    serverError = "";
    firebase
      .auth()
      .createUserWithEmailAndPassword(username, password)
      .catch(err => (serverError = err.message))
      .finally(() => (loading = false));
  };

  let username = "";
  let serverError;
  let password;
  let confirmpwd;

  $: emailError =
    username && !isValidEmail(username) ? "Invalid Email address" : "";
  $: confirmpwdError =
    !!password && !!confirmpwd && confirmpwd !== password
      ? "Password does not match"
      : "";
  $: passError =
    !!password && password.length < 6
      ? "Password must be at least 6 characters"
      : "";
  $: valid =
    !!username &&
    !!password &&
    !!confirmpwd &&
    confirmpwd === password &&
    isValidEmail(username);
</script>

<style>

</style>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-8 mx-auto">
      <Icon cssClass="inline-block text-red-600" height="35" width="35">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </Icon>
      <span on:click={() => navigateTo('/')} class="text-3xl align-middle ml-2">
        SSW LinkAuditor
      </span>
    </div>
    <SocialLogin bind:serverError />
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField
        bind:value={username}
        label="Email Address"
        type="email"
        errorMsg={emailError} />
    </div>
    <div class="mb-4">
      <TextField
        bind:value={password}
        placeholder=""
        label="Password"
        errorMsg={passError}
        type="password" />
    </div>
    <div class="mb-6">
      <TextField
        bind:value={confirmpwd}
        placeholder=""
        type="password"
        errorMsg={confirmpwdError}
        label="Confirm Password" />
    </div>
    {#if serverError}
      <div class="mb-6">
        <p class="py-4 text-red-500 text-base">{serverError}</p>
      </div>
    {/if}
    <div class="flex items-center justify-between">

      <button
        disabled={!valid}
        on:click|preventDefault={signup}
        type="button"
        class="bg-blue-100 hover:bg-blue-500 text-blue-800 font-semibold
        hover:text-white py-2 px-4 border border-blue-500
        hover:border-transparent rounded">
        {#if loading}
          <LoadingCirle />
        {/if}
        Sign up
      </button>
      <a
        class="inline-block align-baseline font-bold text-sm text-blue
        hover:text-blue-darker"
        href="/login">
        Already have an account?
      </a>
    </div>
  </div>
</form>
