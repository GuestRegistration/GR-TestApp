import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import UserAccount from './Views/Account';
import UserNotifications from './Views/Notifications';

export default [
    {
        path: '/account',
        name: 'account',
        component: UserAccount,
        beforeEnter: multiguard([middleware.auth])
      },
    {
        path: '/notifications/:notification?',
        name: 'notification.list',
        component: UserNotifications,
        beforeEnter: multiguard([middleware.auth])
    },
];