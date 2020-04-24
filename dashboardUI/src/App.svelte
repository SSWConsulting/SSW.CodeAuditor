<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import { Router } from "svelte-router-spa";
  import { routes } from "./routes";
  import { navigateTo } from "svelte-router-spa";
  import { userSession, userName, oauthLoginError } from "./stores.js";

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

  firebase
    .auth()
    .getRedirectResult()
    .then(function(result) {
      console.log(result);
      if (result.credential) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      oauthLoginError.set(error)
      // ...
      console.log('oauth login error', error);
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
