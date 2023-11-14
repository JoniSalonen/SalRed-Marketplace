import Marketplace from "./views/Marketplace.js";
import Profile from "./views/Profile.js";
import Register from "./views/Register.js";
import ItemView from "./views/ItemView.js";
import Login from "./views/Login.js";
import AddItem from "./views/AddItem.js";

const pathToRegex = path => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');    

const getParams = match => {
    const values = match.result.slice(1);
    
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

const router = async() => {
    /**
     * Add new views here.
     * Just import the view you cretaed in the views folder
     * and add it to the array like in Marketplace
     * After that, just build the view in its respective js file
     * Find instructions in the Marketplace.js file
    */
   const routes = [
        { path: '/', view: Marketplace },
        { path: '/profile', view: Profile},
        { path: '/item/:id', view: ItemView},
        { path: '/register', view: Register },
        { path: '/login', view: Login },
        { path: '/addItem', view: AddItem },
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);    
    
    if (!match) {
        navigateTo("/");
        return;
    }
    
    const view = new match.route.view(getParams(match));
    await view.setSession();

    if(view.needsLogin && view.session == null){
        navigateTo("/login");
    }
    else if(view.sessionForbidden && view.session != null){
        navigateTo("/");
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
