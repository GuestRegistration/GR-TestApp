import store from './../../store';

const middleware = {
    auth: (to, from, next) => {
        if(window.localStorage.getItem('gr-user')){
            if(store.getters.app_ready && !store.getters.profile_loaded && to.name !== 'profile'){
                next({
                    name: 'profile',
                    query:{
                        redirect: to.fullPath
                    }
                });
            }else{
                next();
            }
        }else{
            next({
                name: 'signin',
                query:{
                    redirect: to.fullPath
                }
            });
        } 
    },
    guest: (to, from, next) => {
        if(!window.localStorage.getItem('gr-user')){
             next()
        }else{
            next({
                name: 'home',
            })
        }
    },
    
    verificationSent: (to, from, next) => {
        if(window.confirmationResult){
            next();
        }else{
            next({
                name: 'signin'
            });
        }
    }
}
 
export default middleware;