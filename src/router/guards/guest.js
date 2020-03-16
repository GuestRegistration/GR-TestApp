import firebase from '../../firebase'


const guestGuard = (to, from, next) => {
    if(window.localStorage.getItem('gr-user')){
        //if already logged in
        next({
            path: '/',
        })
    }else{
        // proceed to route
        next()
    }
}

export default guestGuard