import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import ReservationList from './Views/List.vue';
import ReservationShow from './Views/Show.vue';

export default [
    {
        path: '/reservations',
        name: 'reservation.list',
        component: ReservationList,
        beforeEnter: multiguard([middleware.auth])
    },
    
    {
        path: '/r/:reservation',
        name: 'reservation.show',
        component: ReservationShow,
    },
]