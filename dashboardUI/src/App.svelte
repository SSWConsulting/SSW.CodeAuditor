<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  import { navigateTo } from "svelte-router-spa";
  import { userSession, userName } from "./stores.js";

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
  let loading = true;
  firebase.auth().onAuthStateChanged(user => {
    loading = false;
    if (!user) {
      console.log("user not logged in");
    } else {
      console.log("user is logged in", user);
      userSession.login(user);
      if (window.location.href.indexOf("/login") > 0) {
        navigateTo("/home");
      }
    }
  });

  userName.subscribe(x => {
    console.log("session is", x);
  });
</script>

{#if loading}
  <div>
    <p class="text-lg">Loading...</p>
  </div>
{/if}
<div class:hidden={loading}>
  <Router {routes} {options} />
</div>
