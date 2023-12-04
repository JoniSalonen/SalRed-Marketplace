import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Edit Item");
    this.needsLogin = true;
  }

  /*
   * This function checks if the form is safe to submit
   * The regular expressions were provided by ChatGPT
   */
  formIsSafe(form) {
    const sqlRegex = /['";<>]/;
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;

    var description = form.elements["description"].value;
    var price = form.elements["price"].value;
    
    
    return !sqlRegex.test(description) && 
        numberRegex.test(price) && price >= 0 
        && description.trim().length > 0;
  }

  checkOwner(item){
    return item.owner_id == this.session.id;
  }

  async submitForm() {
    var form = document.getElementById('editItemForm');
    
    if(this.formIsSafe(form)){
        var description = form.elements["description"].value;
        var price = form.elements["price"].value;

        var data = {
            id: this.params.id,
            description: description,
            price: price
        }
        
        axios.post('/postEditItem', data)
        .then(function (response) {
            if(response.data.status == "error"){
                alert(response.data.message);
            }
            else if(response.data.status == "login"){
                alert("You must be logged in to edit items");
                window.location.href = "/login";
            }
            else{
                alert("Item edited successfully");
                window.location.href = "/profile";
            }
        })
        .catch(function (error) {
            alert("Error editing item");
            console.error('Error:', error);
        });
    }
    else{
        alert("Invalid input");
    }
  }

  async fetchData() {
    var item = null;
    await axios
      .get('/getItem?id=' + this.params.id)
      .then((response) => {
        item = response.data[0]
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return item;
    }

  async build() {
    await super.build();

    var item = null;
    item = await this.fetchData();
    
    if(!this.checkOwner(item)){
        alert("You are not the owner of this item");
        window.location.href = "/";
        return;
    }

    var main = document.getElementById("main");
    var container = document.createElement("div");
    container.className = "container mt-5 text-white font-style";
    container.id = "card-div";
    var row = document.createElement("div");
    row.className = "row";
    var col = document.createElement("div");

    //Half of the row for the image
    col.className = "col-6";
    var img = document.createElement("img");
    img.className = "img-fluid";
    img.src = item.image;
    col.appendChild(img);
    row.appendChild(col);

    //Half of the row for the title and the form
    var col2 = document.createElement("div");
    col2.className = "col-6";

    //title is not editable
    var title = document.createElement("h3");
    title.innerHTML = item.title;
    col2.appendChild(title);

    //Create the form to edit the description and the price
    var form = document.createElement("form");
    form.id = "editItemForm";
    //Textarea for the description
    form.appendChild(this.createTextarea("description", "form-control", "Description", 3, true, 500, item.description));
    //Input for the price
    form.appendChild(this.createInput("number", "price", "form-control", "Price", null, true, null, item.price));
    //Submit button
    var submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.className = "btn btn-warning mt-3";
    submitButton.innerHTML = "Save";
    submitButton.addEventListener("click", this.submitForm.bind(this));

    form.appendChild(submitButton);
    col2.appendChild(form);
    row.appendChild(col2);
    container.appendChild(row);
    main.appendChild(container);
  }

  
/**
   * These functions were provided by ChatGPT
   */
  
  createInput(type, id, className, label, accept, required, maxLength, content) {
    var div = document.createElement("div");
    div.className = "form-group";
  
    var labelElement = document.createElement("label");
    labelElement.for = id;
    labelElement.textContent = label;
    div.appendChild(labelElement);
  
    var inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.id = id;
    inputElement.className = className;
    inputElement.name = id;
    if (accept) inputElement.accept = accept;
    if (required) inputElement.required = true;
    if(maxLength) inputElement.setAttribute("maxlength", maxLength);
    if(content) inputElement.value = content;
  
    div.appendChild(inputElement);
  
    return div;
  }
  
  createTextarea(id, className, label, rows, required, maxLength, content) {
    var div = document.createElement("div");
    div.className = "form-group";
  
    var labelElement = document.createElement("label");
    labelElement.for = id;
    labelElement.textContent = label;
    div.appendChild(labelElement);
  
    var textareaElement = document.createElement("textarea");
    textareaElement.id = id;
    textareaElement.className = className;
    textareaElement.name = id;
    textareaElement.rows = rows;
    if (required) textareaElement.required = true;
    if(maxLength) textareaElement.setAttribute("maxlength", maxLength);
    if(content) textareaElement.value = content;
  
    div.appendChild(textareaElement);
  
    return div;
  }
}

