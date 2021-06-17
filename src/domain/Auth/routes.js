import middleware from '../../router/middleware';
import multiguard from 'vue-router-multiguard';

import Signin from './Views/Signin.vue';
import EmailVerification from './Views/EmailVerification.vue';
import ZapierOauth from './Views/ZapierOauth.vue';

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
        // beforeEnter: multiguard([middleware.guest])
    },

    {
        path: '/oauth/zapier',
        name: 'oauth.zapier',
        component: ZapierOauth,
        beforeEnter: multiguard([middleware.auth])
    },
];