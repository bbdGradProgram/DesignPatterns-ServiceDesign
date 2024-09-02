
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/login.vue';
import Home from '../views/home.vue'
import authService from '../services/authService'
import authStore from "../store/authStore";
import leaseList from '../views/leaseList.vue';
import rentals from '../views/rentals.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/lease',
    name: 'Lease',
    component: leaseList 
  },
  {
    path: '/rental',
    name: 'Rental',
    component: rentals 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authService.isAuthenticated()) {
      authStore.setUnauthorizedMessage('Unauthorized: Please log in to access Home page.');
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
