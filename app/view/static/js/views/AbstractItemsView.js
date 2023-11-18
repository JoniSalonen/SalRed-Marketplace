import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params){
        super(params);
    }

    async build(){
        await super.build();
    }
    
    createMarket(items){
        var main = document.getElementById("main");

        //Div to display the items
        var row = document.createElement("div");
        row.className = "row";
        for(let i = 0; i < items.length; i++){
            //Create a new column for each item
            //In mobile 2 items per row, in desktop 3 items per row
            var col1 = document.createElement("div");
            col1.className = "col-6 col-md-4 mb-5";

            //Create a new card for each item
            var card = this.newCard();
            const cardImage = card.querySelector('.card-img-top');
            const cardTitle = card.querySelector('.card-title');
            const cardText = card.querySelector('#cardText');
            const cardPrice = card.querySelector('#cardPrice');
            const cardButton = card.querySelector('.btn');
            //Set the values of the card according to the item
            cardImage.src = items[i].image;
            cardTitle.innerHTML = items[i].title;
            cardText.innerHTML = items[i].description;
            cardPrice.innerHTML = "PRICE: " + items[i].price;
            cardButton.href = "/item/" + items[i].id;

            //Append the card to the column and the column to the row
            col1.appendChild(card);
            row.appendChild(col1);
            main.appendChild(row);
        }
    }

    newCard(){
        //Create a new card to display the item
        var card = document.createElement("div");
        card.className = "card h-100 mx-auto";
        //Item image
        var cardImage = document.createElement("img");
        cardImage.className = "card-img-top img-fluid m-auto";
        cardImage.style = "max-height: 20rem;";

        //Item values: title, description, price and button to see details
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

        //Button to see details
        var div = document.createElement("div");
        div.className = "container text-center";
        var cardButton = document.createElement("a");
        div.appendChild(cardButton);
        cardButton.className = "btn btn-primary";
        cardButton.setAttribute("role", "button");
        cardButton.setAttribute("data-link", "");
        cardButton.innerHTML = "Details";

        //Append the values to the card
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(div);

        //Append the image and the values to the card
        card.appendChild(cardImage);
        card.appendChild(cardBody);
        return card;
    }

}