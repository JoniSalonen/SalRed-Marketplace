import Marketplace from "./views/Marketplace.js";
import Profile from "./views/Profile.js";


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
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        };
    });
    
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);    
    
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        };
    }
    
    const view = new match.route.view();
    
    await view.build();
    
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