export default {
    app: {
        url: process.env.VUE_APP_URL,
        mode: process.env.NODE_ENV
    },

    google: {
        api_key: process.env.VUE_APP_GOOGLE_API_KEY,
    },

    firebase: {
        sdk: {
            apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
            authDomain: process.env.VUE_APP_FIREBASE_DOMAIN,
            databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
            projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VUE_APP_FIREBASE_API_ID,
            measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
        },
        VapidKey: process.env.VUE_APP_FIREBASE_VAPID_KEY
    },
    
    apollo: {
        uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
        client_key: process.env.VUE_APP_GRAPHQL_CLIENT_KEY
    },

    stripe: {
        publishable_key: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
        secret_key: process.env.VUE_APP_STRIPE_SECRET_KEY,
        client_id: process.env.VUE_APP_STRIPE_CLIENT_ID
    },

}