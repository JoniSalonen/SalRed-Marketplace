import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle("Create user");
  }

  async build() {
    document.getElementById("main").innerHTML = `
        <form id="login-form">
        <p>Create new account to the SalRed Marketplace</p>
        <input type="text" name="Name" id="Name" class="login-field" placeholder="Name">
        <input type="email" name="email" id="email" class="login-field" placeholder="Email address">
        <input type="password" name="password" id="passwd" class="login-field" placeholder="Password">
        <input type="submit" value="Register" id="login-form-submit">
        </form>
        `;
  }
}
