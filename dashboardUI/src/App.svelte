<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  import {
    oauthLoginError,
    loginCompleted,
    performingLogin
  } from "./stores.js";

  firebase.initializeApp({
    apiKey: "AIzaSyCHljUPnjRcaQt7lGRDPtZsYWIj3eP4Pok",
    authDomain: "sswlinkauditor-c1131.firebaseapp.com",
    databaseURL: "https://sswlinkauditor-c1131.firebaseio.com",
    projectId: "sswlinkauditor-c1131",
    storageBucket: "sswlinkauditor-c1131.appspot.com",
    messagingSenderId: "258817453920",
    appId: "1:258817453920:web:9779e0dfae77ff2c4c3805",
    measurementId: "G-2EFQW0NCSJ"
  });

  let options = { gaPageviews: true };
  firebase.auth().onAuthStateChanged(user => loginCompleted(user));
  // handle error from OAUTH redirect
  firebase
    .auth()
    .getRedirectResult()
    .catch(error => oauthLoginError.set(error));
</script>

{#if $performingLogin}
  <div>
    <p class="text-lg">Loading...</p>
  </div>
{/if}
<div class:hidden={$performingLogin}>
  <Router {routes} {options} />
</div>
