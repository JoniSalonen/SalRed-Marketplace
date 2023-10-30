import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Profile");
    }

    //Override
    async getHtml(){
        return `
            <h1>Profile</h1>
            <p>You are viewing the Profile!</p>
        `;
    }

}