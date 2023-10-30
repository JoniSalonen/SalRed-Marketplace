import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Marketplace");
    }

    buildHtml(){
        return `
            <h1>Marketplace</h1>
            <p>You are viewing the Marketplace!</p>
        `;
    }

    //Override
    //Each view must build itself
    async getHtml(){
        let div = document.querySelector("#app");
        let head = document.createElement("h1");
        head.textContent = "Marketplace";
        div.appendChild(head);
    }

}