import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params){
        super(params);
    }

    
    createMarket(items){
        var main = document.getElementById("main");

        var row = document.createElement("div");
        row.className = "row";
        for(let i = 0; i < items.length; i++){
            var col1 = document.createElement("div");
            col1.className = "col-6 col-md-4 mb-5";
            var card = this.newCard();
            const cardImage = card.querySelector('.card-img-top');
            const cardTitle = card.querySelector('.card-title');
            const cardText = card.querySelector('#cardText');
            const cardPrice = card.querySelector('#cardPrice');
            const cardButton = card.querySelector('.btn');
            cardImage.src = items[i].image;
            cardTitle.innerHTML = items[i].title;
            cardText.innerHTML = items[i].description;
            cardPrice.innerHTML = "PRICE: " + items[i].price;
            cardButton.href = "/item/" + items[i].id;
            col1.appendChild(card);
            row.appendChild(col1);
            main.appendChild(row);
        }
    }
    async build(){
        await super.build();
    }

    newCard(){
        var card = document.createElement("div");
        card.className = "card h-100 mx-auto";
        var cardImage = document.createElement("img");
        cardImage.className = "card-img-top img-fluid m-auto";
        cardImage.style = "max-height: 20rem;";
        var cardBody = document.createElement("div");
        cardBody.className = "card-body";
        var cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        var cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.id = "cardText";
        var cardPrice = document.createElement("p");
        cardPrice.className = "card-text";
        cardPrice.id = "cardPrice";
        var div = document.createElement("div");
        div.className = "container text-center";
        var cardButton = document.createElement("a");
        div.appendChild(cardButton);
        cardButton.className = "btn btn-primary";
        cardButton.setAttribute("role", "button");
        cardButton.setAttribute("data-link", "");
        cardButton.innerHTML = "Details";
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(div);
        card.appendChild(cardImage);
        card.appendChild(cardBody);
        return card;
    }

}