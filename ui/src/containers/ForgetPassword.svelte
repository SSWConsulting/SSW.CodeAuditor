<script>
  import firebase from "firebase/compat/app";
  import { navigateTo } from "svelte-router-spa";
  import TextField from "../components/misccomponents/TextField.svelte";
  import { isValidEmail } from "../utils/utils.js";
  import LoadingCirle from "../components/misccomponents/LoadingCircle.svelte";

  let loading;
  const sendResetEmail = () => {
    loading = true;
    serverError = "";
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert(`Password Reset Sent to ${email}`);
        navigateTo('/')
      })
      .catch(err => (serverError = err.message))
      .finally(() => (loading = false));
  };

  let email = "";
  let serverError;

  $: emailError =
    email && !isValidEmail(email) ? "Invalid Email address" : "";
  $: valid =
    !!email &&
    isValidEmail(email);
</script>

<style>

</style>

<form class="container mx-auto max-w-sm py-12">
  <div class="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
    <div class="mb-8 mx-auto">
      <span on:click={() => navigateTo('/')} class="align-middle ml-2">
        <img
          class="h-7 object-cover"
          src="https://i.ibb.co/8mfYrX2/Code-Auditor-footer.png"
          alt="CodeAuditor" />
      </span>
    </div>
    <hr class="mb-4" />
    <div class="mb-4">
      <TextField
        bind:value={email}
        label="Email Address"
        type="email"
        errorMsg={emailError} />
    </div>
    {#if serverError}
      <div class="mb-6">
        <p class="py-4 text-red-500 text-base">{serverError}</p>
      </div>
    {/if}
    <div class="flex items-center justify-between">
      <button
        disabled={!valid}
        on:click|preventDefault={sendResetEmail}
        type="button"
        class="bgred hover:bg-red-800 text-white font-semibold py-2 px-4 border
        hover:border-transparent rounded">
        {#if loading}
          <LoadingCirle />
        {/if}
        Send Password Reset
      </button>
    </div>
  </div>
</form>
