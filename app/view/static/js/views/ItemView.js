import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params){
        super(params);
        this.setTitle("Item Details");
    }

    /**
     * This is a function to fetch data from the database
     * asynchronously.
     * Remember that you must define the route in server.js
     */
    async fetchData() {
        var item = null;
        await axios.get('/getItem?id=' + this.params.id)
            .then(response => {
                item = response.data[0];
            })
            .catch(error => {
                console.error('Error:', error);
            });
        return item;
    }

    //Override
    async build(){
        var item = null;
        item = await this.fetchData();
        console.log(item);
        var main = document.getElementById("main");
        this.resetMain();
        //Create container for card and card
        var row = document.createElement("div");
        row.className = "row my-5";
        var col1 = document.createElement("div");
        col1.className = "col-6 mx-auto";
        var card = document.createElement("div");
        card.className = "card h-70";

        //Create card image
        var cardImage = document.createElement("img");
        cardImage.className = "card-img-top img-fluid m-auto";
        cardImage.src = item.image;
        card.appendChild(cardImage);

        //Create card body with all the info
        var cardBody = document.createElement("div");
        cardBody.className = "card-body";
        var cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.innerHTML = item.title;
        cardBody.appendChild(cardTitle);
        var cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.innerHTML = item.description;
        cardBody.appendChild(cardText);
        var cardPrice = document.createElement("p");
        cardPrice.className = "card-text";
        cardPrice.innerHTML = "PRICE: " + item.price;
        cardBody.appendChild(cardPrice);
        var cardOwner = document.createElement("p");
        cardOwner.className = "card-text";
        cardOwner.innerHTML = "Owned by: " + item.name;
        cardBody.appendChild(cardOwner);

        //Create button, different if the user is the owner of the item
        var div = document.createElement("div");
        div.className = "container text-center";
        var cardButton = document.createElement("a");
        div.appendChild(cardButton);
        cardButton.className = "btn btn-primary";
        cardButton.setAttribute("role", "button");
        cardButton.setAttribute("data-link", "");
        /**
         * 
         * if(user.id == item.owner_id){
         *       cardButton.innerHTML = "Edit";
         *       cardButton.href = "/editItem/" + item.id;
         *  }else{
         *      cardButton.innerHTML = "Buy";
         *      cardButton.href = "/buyItem/" + item.id;
         * 
         * 
         */
        cardButton.innerHTML = "Buy";
        cardButton.href = "/buyItem/" + item.id;
        cardBody.appendChild(div);
        card.appendChild(cardBody);

        col1.appendChild(card);
        row.appendChild(col1);
        main.appendChild(row);
    }


}