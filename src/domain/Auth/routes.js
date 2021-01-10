import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import Signin from './Views/Signin.vue';
import EmailVerification from './Views/EmailVerification.vue';

export default [
    {
        path: '/signin',
        name: 'signin',
        component: Signin,
        beforeEnter: multiguard([middleware.guest])
      },

    {
        path: '/email-connect',
        name: 'email.verification',
        component: EmailVerification,
    },
];