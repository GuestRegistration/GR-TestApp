import Vue from 'vue';
import VueRouter from 'vue-router';
import middleware from './middleware';
import multiguard from 'vue-router-multiguard';


import AuthRoutes from '../domain/Auth/routes';
import UserRoutes from '../domain/User/routes';
import PropertyRoutes from '../domain/Property/routes';
import ReservationRoutes from '../domain/Reservation/routes';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    beforeEnter: multiguard([middleware.auth])
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
