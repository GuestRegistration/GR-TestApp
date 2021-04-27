import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import PropertyList from './Views/List.vue';
import PropertyShow from './Views/Show.vue';
import PropertyRules from './Views/Rules.vue';
import PropertyReservation from './Views/Reservation.vue';
import PropertyCreate from './Views/Create.vue'
import PropertySettings from './Views/Settings.vue'
import PropertyStripeConnectCallback from './Views/StripeConnectCallback.vue'

export default [
    {
        path: '/properties',
        name: 'property.list',
        component: PropertyList,
        beforeEnter: multiguard([middleware.auth])
    },

    {
        path: '/new-property/:tab?',
        name: 'property.create',
        component: PropertyCreate,
        beforeEnter: multiguard([middleware.auth])
    },

    {
        path: '/property/:id/settings/:tab?',
        name: 'property.settings',
        component: PropertySettings,
        beforeEnter: multiguard([middleware.auth])
    },

    {
        path: '/stripe-connect',
        name: 'property.stripe.connect.callback',
        component: PropertyStripeConnectCallback,
        beforeEnter: multiguard([middleware.auth])
    },

    {
        path: '/property/:id',
        name: 'property.show',
        component: PropertyShow,
    },
    
    {
        path: '/property/:id/rules',
        name: 'property.rules',
        component: PropertyRules,
    }, 
        
    {
        path: '/host/reservation/:id',
        name: 'property.reservation.show',
        component: PropertyReservation,
        beforeEnter: multiguard([middleware.auth])
    },

];