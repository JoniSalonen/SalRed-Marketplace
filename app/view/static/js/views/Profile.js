import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  
    constructor(){
    super();
    this.setTitle("Profile");
  }

  async fetchData() {
    var user = null;
    await axios
      .get('/profile')
      .then((response) => {
        user = response.data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return user;
  }

  //Override
  async build() {
    var user = null;

    // placeholder for authentication
    var authentication = false;

    user = await this.fetchData();
    console.log(user);

    // placeholder for authentication
    if (authentication == true) {
      // If user has logged in show this
      document.getElementById("main").innerHTML = `
            <h1>Profile</h1>
            <p> Profile page</p>

        `;
    } else {
      // If user has not logged in show user the log in screen
      document.getElementById("main").innerHTML = `
        <form id="login-form">
        
        <p>Log in using existing account</p>
        <input type="email" name="email" id="email" class="login-field" placeholder="Email" required>
        <div class="valid-feedback">Valid.</div>
        <div class="invalid-feedback">Invalid</div>

        <input type="password" name="password" id="passwd" class="login-field" placeholder="Password" required>
        <input type="submit" value="Login" id="login-form-submit">
        <div class="valid-feedback">Valid.</div>
        <div class="invalid-feedback">Invalid</div>

        </form>
        <p></p>
        <p>OR</p>
        <p></p>
        <p>Don't have account? You can create user  <a href="/register" data-link>here</a></p>
        `;
    };
  };
};
