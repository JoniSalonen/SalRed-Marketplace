import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Profile");
    }

    async fetchData() {
        var user = null;
        await axios.get('/profile/:id')
            .then(response => {
                user = response.data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        return user;
    }

    //Override
    async getHtml(){
        return `
            <h1>Profile</h1>
            <p>You are viewing the Profile!</p>
        `;
    }

    //Override
    async build(){
        var user = null;
        user = await this.fetchData();
        console.log(user);
        document.getElementById("profile").innerHTML = 
        `
        <h1>Profile</h1>
        <p> Profile page</p>
        `;
    }

}