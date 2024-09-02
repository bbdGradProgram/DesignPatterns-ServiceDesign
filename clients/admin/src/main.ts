import { createApp } from 'vue';
import App from './App.vue';
import './styles/style.css'
import router from './router';
import vue3GoogleLogin from 'vue3-google-login'

const CLIENT_ID = '11695021444-gb72qvk190v3bda0gunhqpg4sn3sueaq.apps.googleusercontent.com';

const app = createApp(App);

app.use(router);
app.use(vue3GoogleLogin, {
    clientId: CLIENT_ID
});

app.mount('#app');
