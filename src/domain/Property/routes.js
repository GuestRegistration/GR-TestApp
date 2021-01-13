import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import PropertyList from './Views/List.vue';
import PropertyShow from './Views/Show.vue';
import PropertyRules from './Views/Rules.vue';
import PropertyReservation from './Views/Reservation.vue';

export default [
    {
        path: '/properties',
        name: 'property.list',
        component: PropertyList,
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