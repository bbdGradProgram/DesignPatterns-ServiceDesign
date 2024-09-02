<template>
  <div class="full">
    <div class="login-page">
      <div class="login-container">
        <header>Welcome to property rental admin portal</header>
        <h1>Effortlessly Manage Your Rental Properties</h1>
        <p>Access and oversee all your properties and leases in one convenient location, ensuring seamless and efficient property management.</p>
        <div v-if="unauthorizedMessage" class="unauthorized-message">{{ unauthorizedMessage }}</div>
        <div class="login-actions">
          <hr class="line-under-p">
          <button @click="loginButton">Login with Google
            <img src="../assets/google.png" alt="">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import {gapi} from "gapi-script";
import authService from '../services/authService';
import authStore from "../store/authStore";

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();

    onMounted(() => {
      // Initialize the Google API client
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: '11695021444-gb72qvk190v3bda0gunhqpg4sn3sueaq.apps.googleusercontent.com',
        });
      });
    });

    const loginButton = () => {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signIn().then((googleUser: { getBasicProfile: () => any; getAuthResponse: () => { (): any; new(): any; id_token: any; }; }) => {
        const profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        // You can also get the token if needed
        const id_token = googleUser.getAuthResponse().id_token;
        console.log('ID Token: ' + id_token);
        authService.setToken(id_token);
        authStore.clearUnauthorizedMessage();

        // Navigate to the home page after successful login
        router.push('/home');
      }).catch((error: any) => {
        console.error('Error signing in', error);
      });
    };

    return {
      loginButton,
      unauthorizedMessage: authStore.unauthorizedMessage,
    };
  },
});
</script>

<style scoped>
  @import '../styles/login.css';
</style>