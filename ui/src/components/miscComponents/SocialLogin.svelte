<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import LoadingCirle from "./LoadingCirle.svelte";

  let loading;
  const login = promise => {
    serverError = "";
    loading = true;
    return promise
      .catch(err => (serverError = err.message))
      .finally(() => (loading = false));
  };

  const loginGmail = () =>
    login(
      firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    );

  const loginFacebook = () =>
    login(
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.FacebookAuthProvider())
    );

  export let serverError;
</script>

<style>
  .social {
    width: 270px;
  }
</style>

<div class="mb-2 mx-auto">
  <button
    on:click|preventDefault={loginGmail}
    type="button"
    disabled={loading}
    class="social bg-white hover:bg-red-400 block hover:text-white py-2 px-4
    border border-red-700 hover:border-transparent rounded">
    <svg
      width="22"
      height="22"
      class="inline-block mr-1"
      viewBox="0 0 256 262"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid">
      <path
        d="M255.878
        133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45
        12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023
        2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4" />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605
        86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257
        13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527
        1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853" />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994
        1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644
        0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05" />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479
        19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393
        29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251
        74.414-54.251"
        fill="#EB4335" />
    </svg>
    Sign In Using Google
    {#if loading}
      <LoadingCirle />
    {/if}
  </button>
</div>
<div class="mb-4 mx-auto">
  <button
    on:click|preventDefault={loginFacebook}
    type="button"
    disabled={loading}
    class="social bg-white hover:bg-blue-500 block hover:text-white py-2 px-4
    border border-blue-700 hover:border-transparent rounded">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      class="inline-block"
      viewBox="88.428 12.828 107.543 207.085">
      <path
        d="M158.232 219.912v-94.461h31.707l4.747-36.813h-36.454V65.134c0-10.658
        2.96-17.922
        18.245-17.922l19.494-.009V14.278c-3.373-.447-14.944-1.449-28.406-1.449-28.106
        0-47.348 17.155-47.348
        48.661v27.149H88.428v36.813h31.788v94.461l38.016-.001z"
        fill="#3c5a9a" />
    </svg>
    Sign In Using Facebook
    {#if loading}
      <LoadingCirle />
    {/if}
  </button>
</div>
