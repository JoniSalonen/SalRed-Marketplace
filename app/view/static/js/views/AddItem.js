import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Add Item");
    this.needsLogin = true;
    this.formIsSafe = this.formIsSafe.bind(this);
  }

  /*
   * This function checks if the form is safe to submit
   * The regular expressions were provided by ChatGPT
   */
  formIsSafe(form) {
    const sqlRegex = /['";<>]/;
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    var title = form.elements["title"].value;
    var description = form.elements["description"].value;
    var price = form.elements["price"].value;
    var files = form.elements["image"].files;
    
    
    return !sqlRegex.test(title) && !sqlRegex.test(description) && 
        numberRegex.test(price) && price >= 0 && title.trim().length > 0 
        && description.trim().length > 0 
        && price.trim().length > 0 && files.length === 1 
        && allowedTypes.includes(files[0].type);

  }

  async submitForm() {
    var form = document.getElementById('addItemForm');
    
    if(this.formIsSafe(form)){  
        var formData = new FormData(form);
        
        axios.post('/postAddItem', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (response) {
            if(response.data.status == "error"){
                alert(response.data.message);
            }
            else{
                alert("Item added successfully");
                window.location.replace("/profile");
            }
        })
        .catch(function (error) {
            alert("Error adding item");
            console.error('Error:', error);
        });
    }
    else{
        alert("Invalid input");
    }
  }


  async build() {
    await super.build();
    
    var main = document.getElementById("main");
    var container = document.createElement("div");
    container.className = "container mt-5 text-light";

    // Create the form
    var form = document.createElement("form");
    form.id = "addItemForm";
    form.action = "#";
    form.method = "post";
    form.enctype = "multipart/form-data";

    // Create and append Upload Image input
    form.appendChild(this.createInput("file", "image", "form-control-file", "Upload Image", "image/*", true, null));
    // Create and append Title input
    form.appendChild(this.createInput("text", "title", "form-control", "Title", null, true, 50));
    // Create and append Description textarea
    form.appendChild(this.createTextarea("description", "form-control", "Description", 3, true, 500));
    // Create and append Price input
    form.appendChild(this.createInput("number", "price", "form-control", "Price", null, true, null));

    // Create and append Submit button
    var submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.className = "btn btn-primary mt-3 font-style";
    submitButton.textContent = "Save";
    submitButton.addEventListener("click", this.submitForm.bind(this));
    form.appendChild(submitButton);

    // Append the form to the container
    container.appendChild(form);
    main.appendChild(container);

  }

  /**
   * These functions were provided by ChatGPT
   */

  // Function to create input elements
  createInput(type, id, className, label, accept, required, maxLength) {
    var div = document.createElement("div");
    div.className = "form-group font-style";
  
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
  
    div.appendChild(inputElement);
  
    return div;
  }
  
  // Function to create textarea elements
  createTextarea(id, className, label, rows, required, maxLength) {
    var div = document.createElement("div");
    div.className = "form-group font-style";
  
    var labelElement = document.createElement("label");
    labelElement.for = id;
    labelElement.textContent = label;
    div.appendChild(labelElement);
  
    var textareaElement = document.createElement("textarea");
    textareaElement.id = id;
    textareaElement.className = className;
    textareaElement.name = id;
    textareaElement.rows = rows;
    if (maxLength) textareaElement.setAttribute("maxlength", maxLength);
    if (required) textareaElement.required = true;
  
    div.appendChild(textareaElement);
  
    return div;
  }
}

