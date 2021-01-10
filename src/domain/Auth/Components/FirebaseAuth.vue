<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from '@/firebase';
import 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

export default {
  name: 'FirebaseAuth',
  props: {
    redirect: {
      type: String,
      default: () => '/'
    },
  },
  mounted(){
    var firebaseui = require('firebaseui');

      let ui = firebaseui.auth.AuthUI.getInstance() ?? new firebaseui.auth.AuthUI(firebase.auth);
      let uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            if(!this.redirect){
              this.$emit('authenticated', authResult, redirectUrl)
              return false;
            }
            return true;
          },
          signInFailure: function(error) {
            console.log(error);
            // For merge conflicts, the error.code will be
            // 'firebaseui/anonymous-upgrade-merge-conflict'.
            if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
              return Promise.resolve();
            }
            // The credential the user tried to sign in with.
            var cred = error.credential;
            // Copy data from anonymous user to permanent user and delete anonymous
            // user.
            // ...
            // Finish sign-in after data is copied.
            return firebase.firebase.auth().signInWithCredential(cred);
          },
         
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: this.redirect,
        signInOptions: [
            {
                provider: firebase.firebase.auth.EmailAuthProvider.PROVIDER_ID,
                signInMethod: firebase.firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            },
            {
                provider: firebase.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                recaptchaParameters: {
                    type: 'image', // 'audio'
                    size: 'invisible', // 'invisible' or 'compact'
                    badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                },
            },
            {
              provider: firebase.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
              }
            }
            
        ],
      }

      ui.start('#firebaseui-auth-container', uiConfig);
  }
}
</script>

