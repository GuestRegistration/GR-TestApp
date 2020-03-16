import firebase from '../../firebase'


const authGuard = (to, from, next) => {
    if(!window.localStorage.getItem('gr-user')){
        //if not logged in
        next({
            path: '/signin',
            query:{
                redirect: to.fullPath
            }
        })
    }else{
        // proceed to route
        next()
    }
}

export default authGuard