/**
 * SPA router cretaed using this tutorial: https://youtu.be/6BozpmSjk-Y?si=mbTw5DeRiFdKPQvr
 * 
 */

import Marketplace from "./views/Marketplace.js";
import Profile from "./views/Profile.js";
import Register from "./views/Register.js";
import ItemView from "./views/ItemView.js";
import Login from "./views/Login.js";
import AddItem from "./views/AddItem.js";
import EditItem from "./views/EditItem.js";
import UserView from "./views/UserView.js";

//This function is used to convert the path to a regular expression to get the parameters
//from paths like /item/:id
const pathToRegex = path => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');    
const getParams = match => {
    const values = match.result.slice(1);
    
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

//For each path, the index checks if it has a view for it
//If it does, it creates a new instance of the view and calls the build function
const router = async() => {
   const routes = [
        { path: '/', view: Marketplace },
        { path: '/profile', view: Profile},
        { path: '/item/:id', view: ItemView},
        { path: '/editItem/:id', view: EditItem},
        { path: '/register', view: Register },
        { path: '/login', view: Login },
        { path: '/addItem', view: AddItem },
        {path: '/user/:name', view: UserView},
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);    
    
    //If there is no match, send to Home page
    if (!match) {
        navigateTo("/");
        return;
    }
    
    const view = new match.route.view(getParams(match));
    await view.setSession();

    //Redirect to log in when needed
    if(view.needsLogin && view.session == null){
        navigateTo("/login");
    }
    //Avoid log in or registerin when logged in
    else if(view.sessionForbidden && view.session != null){
        navigateTo("/profile");
    }
    else{
        await view.build();
    }
    
    
}

/*All link buttons must have data-link attribute to avoid page reloads
* <a href="/posts" data-link>Posts</a>
*/
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {

  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});
