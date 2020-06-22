import Vue from 'vue'
import VueRouter from 'vue-router'
import middleware from './middleware'
import multiguard from 'vue-router-multiguard';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Reservations.vue'),
    beforeEnter: multiguard([middleware.auth])
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../views/Auth/Signin.vue'),
    beforeEnter: multiguard([middleware.guest])
  },
  {
    path: '/signin/verification',
    name: 'signin.verification',
    component: () => import('../views/Auth/Verification.vue'),
    beforeEnter: multiguard([middleware.guest, middleware.verificationSent])
  },

  {
    path: '/r/:reservation',
    name: 'reservation.show',
    component: () => import('../views/Reservation.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    beforeEnter: multiguard([middleware.auth])
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
