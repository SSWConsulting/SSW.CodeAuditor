<script>
  import firebase from "firebase/compat/app";
  import "firebase/compat/performance";
  import Spinner from "./components/misccomponents/Spinner.svelte";
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  import {
    oauthLoginError,
    loginCompleted,
    performingLogin,
  } from "./stores.js";
  import 'pace-js';

  firebase.initializeApp({
    apiKey: "AIzaSyCHljUPnjRcaQt7lGRDPtZsYWIj3eP4Pok",
    authDomain: "sswlinkauditor-c1131.firebaseapp.com",
    databaseURL: "https://sswlinkauditor-c1131.firebaseio.com",
    projectId: "sswlinkauditor-c1131",
    storageBucket: "sswlinkauditor-c1131.appspot.com",
    messagingSenderId: "258817453920",
    appId: "1:258817453920:web:9779e0dfae77ff2c4c3805",
    measurementId: "G-2EFQW0NCSJ",
  });

  firebase.auth().onAuthStateChanged((user) => loginCompleted(user));
  // handle error from OAUTH redirect
  firebase
    .auth()
    .getRedirectResult()
    .catch((error) => oauthLoginError.set(error));
</script>

<style lang="scss" global>
  @import './variables.scss';
  @import './global.scss';
</style>

{#if $performingLogin}
  <div class="h-full flex items-center container mx-auto">
    <Spinner />
  </div>
{/if}
<div class:hidden={$performingLogin}>
  <Router {routes} />
</div>
