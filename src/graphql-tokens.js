 /**
  * Tokens that are used for authentication both for client and the user
  */
import { auth } from './firebase';
import helper from './helper';
import config from './config';

export default async () => {
  const token = {
    client : `Bearer ${config.apollo.client_key}`,
    user: `Bearer ${window.localStorage.getItem('gr-user')}`
  }
  if(window.localStorage.getItem('gr-user') && auth.currentUser && window.localStorage.getItem('token-expires') < helper.nowTimestamp()){
    // It's over an hour now, refresh idToken;
    const newToken = await auth.currentUser.getIdToken();
    window.localStorage.setItem('gr-user', newToken);
    window.localStorage.setItem('token-expires', helper.nowTimestamp()+3600);
    token.user = `Bearer ${newToken}`;
  }
  return token;
 }
