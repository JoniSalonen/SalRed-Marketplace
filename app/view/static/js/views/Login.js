import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Log In");
    this.submitForm = this.submitForm.bind(this);
    this.sessionForbidden = true;
  }

  //Reg ex provided by ChatGPT
  isInputSafe(input) {
    const sqlRegex = /['";<>]/;
    return !sqlRegex.test(input) && input.trim().length > 0;
  }

  async submitForm(){
    var form = document.getElementById("registerForm");
    var username = form.elements["username"].value;
    var password = form.elements["password"].value;
    if(!this.isInputSafe(username) || !this.isInputSafe(password)){
      alert("Invalid username or password");
      return;
    }
    else{
      var data = {
        user: username,
        pwd: password
      }
      await axios.post('/postLogin', data)
        .then(response => {
          if(response.data.status == "error"){
            alert(response.data.message);
          }
          else{
            window.location.href = "/";
          }
        })
        .catch(error => {
          console.error('Error:', error);
            alert("Error logging in");
        });
    }
  }

  async build() {
    await super.build();

    var main = document.getElementById("main");
    var container = document.createElement("div");
    container.className = "container mt-5 font-style";
    var col = document.createElement("div");
    col.className = "col-md-6 offset-md-3";

    // Create the form to Log In
    var form = document.createElement("form");
    form.id = "registerForm";

    //Form gorup for the username
    var formGroup1 = document.createElement("div");
    formGroup1.className = "form-group";
    var label1 = document.createElement("label");
    label1.for = "username";
    label1.innerHTML = "Username:";
    var input1 = document.createElement("input");
    input1.type = "text";
    input1.className = "form-control";
    input1.id = "username";
    input1.name = "username";
    input1.required = true;
    formGroup1.appendChild(label1);
    formGroup1.appendChild(input1);
    form.appendChild(formGroup1);

    //Form group for the password
    var formGroup2 = document.createElement("div");
    formGroup2.className = "form-group";
    var label2 = document.createElement("label");
    label2.for = "password";
    label2.innerHTML = "Password:";
    var input2 = document.createElement("input");
    input2.type = "password";
    input2.className = "form-control";
    input2.id = "password";
    input2.name = "password";
    input2.required = true;
    formGroup2.appendChild(label2);
    formGroup2.appendChild(input2);
    form.appendChild(formGroup2);

    //Create and append Submit button
    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary mt-3";
    button.innerHTML = "Log in";
    form.appendChild(button);

    //Create link to register
    var p = document.createElement("p");
    p.className = "mt-3";
    p.innerHTML = "No account yet? <a href='/register' data-link>Sign up</a>";
    form.appendChild(p);
    button.addEventListener("click", this.submitForm);


    col.appendChild(form);
    container.appendChild(col);
    main.appendChild(container);

  }
}
