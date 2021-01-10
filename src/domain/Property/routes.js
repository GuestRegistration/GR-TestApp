import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import PropertyList from './Views/List.vue';
import PropertyShow from './Views/Show.vue';
import PropertyRules from './Views/Rules.vue';
import PropertyReservation from './Views/Reservation.vue';
import PropertyReservations from './Views/Reservations.vue';
import PropertyNotifications from './Views/Notifications.vue';

export default [
    {
        path: '/properties',
        name: 'property.list',
        component: PropertyList,
        beforeEnter: multiguard([middleware.auth])
    },

    {
        path: '/property/:property',
        name: 'property.show',
        component: PropertyShow,
    },
    
    {
        path: '/property/:property/rules',
        name: 'property.rules',
        component: PropertyRules,
    }, 
    
    {
        path: '/host/reservations',
        name: 'property.reservation.list',
        component: PropertyReservations,
        beforeEnter: multiguard([middleware.auth])
    },
    
    {
        path: '/host/reservation/:reservation',
        name: 'property.reservation.show',
        component: PropertyReservation,
        beforeEnter: multiguard([middleware.auth])
    },

      
    {
        path: '/host/notifications',
        name: 'property.notifications',
        component: PropertyNotifications,
        beforeEnter: multiguard([middleware.auth])
    },

];