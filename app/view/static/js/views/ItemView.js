import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(params){
        super(params);
        this.setTitle("Item Details");
    }

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

    async buyItem(){
        
        var data = {
            id: this.params.id
        }
        await axios.post('/buyItem', data)
            .then(response => {
                if(response.data.status == "error"){
                    alert(response.data.message);
                }
                else if(response.data.status == "login"){
                    alert("You must be logged in to buy items");
                    window.location.href = "/login";
                }
                else{
                    alert("Item bought successfully");
                    window.location.href = "/";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Error buying item");
            });
    }

    deleteItem(){
        axios.post('/deleteItem', {id: this.params.id})
            .then(response => {
                if(response.data.status == "error"){
                    alert(response.data.message);
                }
                else if(response.data.status == "login"){
                    alert("You must be logged in to delete items");
                    window.location.href = "/login";
                }
                else{
                    alert("Item deleted successfully");
                    window.location.href = "/";
                }
            });
    }

    //Override
    async build(){
        await super.build();

        //Get the item from the server
        var item = null;
        item = await this.fetchData();
        var main = document.getElementById("main");

        //Create row to display the item
        var row = document.createElement("div");
        row.className = "row my-5";
        var col1 = document.createElement("div");

        //Create column to display the item, takes half of the screen
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
        //Ttle
        var cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.innerHTML = item.title;
        cardBody.appendChild(cardTitle);
        //Description
        var cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.innerHTML = item.description;
        cardBody.appendChild(cardText);
        //Price
        var cardPrice = document.createElement("p");
        cardPrice.className = "card-text";
        cardPrice.innerHTML = "PRICE: " + item.price;
        cardBody.appendChild(cardPrice);
        //Owner
        var cardOwner = document.createElement("p");
        cardOwner.className = "card-text";
        cardOwner.innerHTML = "Owned by: ";
        var cardOwnerLink = document.createElement("a");
        cardOwnerLink.href = "/user/" + item.name;
        cardOwnerLink.innerHTML = item.name;
        cardOwnerLink.setAttribute("data-link", "");
        cardOwner.appendChild(cardOwnerLink);
        cardBody.appendChild(cardOwner);

        //Create button, different if the user is the owner of the item
        var div = document.createElement("div");
        div.className = "container text-center";
        var cardButton = document.createElement("a");
        div.appendChild(cardButton);
        cardButton.className = "btn btn-primary";
        cardButton.setAttribute("role", "button");
        cardButton.setAttribute("type", "button");
        
        //Button for the owner
        if(this.session != null && 
            this.session.id == item.owner_id){
            cardButton.innerHTML = "Edit";
            cardButton.href = "/editItem/" + item.id;
            cardButton.setAttribute("data-link", "");
            var button = document.createElement("button");
            button.className = "btn btn-danger";
            button.setAttribute("type", "button");
            button.setAttribute("data-bs-toggle", "modal");
            button.setAttribute("data-bs-target", "#deleteDialog");
            button.innerHTML = "Delete";
            div.appendChild(button);
           }
           //Button for the rest of users
        else{
            cardButton.innerHTML = "Buy";
            cardButton.addEventListener("click", this.buyItem.bind(this));
        }
        
        cardBody.appendChild(div);
        card.appendChild(cardBody);

        var dialog = this.createDialog();

        main.appendChild(dialog);
        col1.appendChild(card);
        row.appendChild(col1);
        main.appendChild(row);
    }

    //This fucntion was provided by ChatGPT propmting it with the Bootstrap documentation
    createDialog(){
        var modalContainer = document.createElement('div');
        modalContainer.className = 'modal fade';
        modalContainer.id = 'deleteDialog';
        modalContainer.tabIndex = '-1';
        modalContainer.setAttribute('aria-labelledby', 'exampleModalLabel');
        modalContainer.setAttribute('aria-hidden', 'true');

        // Create modal dialog
        var modalDialog = document.createElement('div');
        modalDialog.className = 'modal-dialog';

        // Create modal content
        var modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Create modal header
        var modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        // Create modal title
        var modalTitle = document.createElement('h5');
        modalTitle.className = 'modal-title';
        modalTitle.id = 'exampleModalLabel';
        modalTitle.textContent = 'Wait!';

        // Create close button
        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'Close');

        // Append title and close button to modal header
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Create modal body
        var modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalBody.textContent = 'Do you want to delete this item?';

        // Create modal footer
        var modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        // Create close button for footer
        var closeButtonFooter = document.createElement('button');
        closeButtonFooter.type = 'button';
        closeButtonFooter.className = 'btn btn-secondary';
        closeButtonFooter.setAttribute('data-bs-dismiss', 'modal');
        closeButtonFooter.textContent = 'Close';

        // Create save changes button
        var saveChangesButton = document.createElement('button');
        saveChangesButton.type = 'button';
        saveChangesButton.className = 'btn btn-danger';
        saveChangesButton.textContent = 'Delete';
        saveChangesButton.addEventListener("click", this.deleteItem.bind(this));

        // Append buttons to modal footer
        modalFooter.appendChild(closeButtonFooter);
        modalFooter.appendChild(saveChangesButton);

        // Append header, body, and footer to modal content
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);

        // Append content to modal dialog
        modalDialog.appendChild(modalContent);

        // Append dialog to modal container
        modalContainer.appendChild(modalDialog);
        return modalContainer;
    }


}