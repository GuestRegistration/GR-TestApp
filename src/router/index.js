import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from './guards/auth'
import guest from './guards/guest'
import multiguard from 'vue-router-multiguard';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Reservations.vue'),
    beforeEnter: multiguard([auth])
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Signin.vue'),
    beforeEnter: multiguard([guest])
  },
  {
    path: '/r/:reservation',
    name: 'reservation',
    component: () => import('../views/Reservation.vue'),
    // beforeEnter: multiguard([auth])
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
