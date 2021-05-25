import Vue from 'vue';
import VueRouter from 'vue-router';
import middleware from './middleware';
import multiguard from 'vue-router-multiguard';

import Home from '../views/Home.vue';

import AuthRoutes from '../domain/Auth/routes';
import UserRoutes from '../domain/User/routes';
import PropertyRoutes from '../domain/Property/routes';
import ReservationRoutes from '../domain/Reservation/routes';
import SignaturePad from '../components/Utilities/SignaturePad.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/index.html',
    name: 'home',
    alias: '/',
    component: Home,
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/signature',
    component: SignaturePad,
  },
].concat(
  AuthRoutes, UserRoutes, PropertyRoutes, ReservationRoutes
);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
})


export default router;
