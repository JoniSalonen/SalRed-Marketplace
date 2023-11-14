import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Add Item");
    this.needsLogin = true;
  }

  formIsSafe(form) {
    const sqlRegex = /['";<>]/;
    const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    var title = form.elements["title"].value;
    var description = form.elements["description"].value;
    var price = form.elements["price"].value;
    var files = form.elements["image"].files;
    
    console.log(title);
    console.log(description);
    console.log(price);
    console.log(files);
    return !sqlRegex.test(title) && !sqlRegex.test(description) && 
    numberRegex.test(price) && title.trim().length > 0 && description.trim().length > 0 
    && price.trim().length > 0 && files.length === 1 && allowedTypes.includes(files[0].type);

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
          console.log('Success:', response);
        })
        .catch(function (error) {
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
    container.className = "container mt-5";
    var form = document.createElement("form");
    form.id = "addItemForm";
    form.action = "#"; // Replace with the appropriate URL
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
    submitButton.className = "btn btn-primary mt-3";
    submitButton.textContent = "Save";
    submitButton.addEventListener("click", this.submitForm.bind(this));
    form.appendChild(submitButton);

    // Append the form to the container
    container.appendChild(form);
    main.appendChild(container);

  }

  // Function to create input elements
  

  createInput(type, id, className, label, accept, required, maxLength) {
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
    if(maxLength) inputElement.maxLength = maxLength;
  
    div.appendChild(inputElement);
  
    return div;
  }
  
  // Function to create textarea elements
  createTextarea(id, className, label, rows, required) {
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
  
    div.appendChild(textareaElement);
  
    return div;
  }
}

