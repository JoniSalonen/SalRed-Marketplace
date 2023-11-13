import AbstractItemsView from "./AbstractItemsView.js";

export default class extends AbstractItemsView {
  
    constructor(){
    super();
    this.setTitle("Profile");
    this.needsLogin = true;
  }

  async fetchData() {
    var items = null;
    await axios
      .get('/getUserItems')
      .then((response) => {
        items = response.data
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return items;
    }

  async logout(){
    axios.post('/logout', {})
      .then(response => {
        if(response.data.status == "ok"){
          window.location.href = "/";
        }
        else{
          alert("Error logging out");
        }
      }).catch(error => {
        console.error('Error:', error);
        alert("Error logging out");
      });
  }

  //Override
  async build() {
    await super.build();

    var items = null;
    items = await this.fetchData();
    var main = document.getElementById("main");
    var userContainer = document.createElement("div");
    userContainer.className = "container my-5";
    var name = document.createElement("h1");
    name.innerHTML = this.session.name;
    var sales = document.createElement("h3");
    sales.innerHTML = "Sales: " + this.session.sales;
    var purchases = document.createElement("h3");
    purchases.innerHTML = "Purchases: " + this.session.purchases;
    var coins = document.createElement("h3");
    coins.innerHTML = "Coins: " + this.session.coins;
    userContainer.appendChild(name);
    userContainer.appendChild(sales);
    userContainer.appendChild(purchases);
    userContainer.appendChild(coins);
    var div = document.createElement("div");
    div.className = "container text-center";
    var button = document.createElement("button");
    button.className = "btn btn-primary";
    button.innerHTML = "Add Item";
    button.addEventListener("click", function () {
      window.location.href = "/addItem";
    });
    div.appendChild(button);
    var div2 = document.createElement("div");
    div2.className = "container text-left";
    var logout = document.createElement("button");
    button.className = "btn btn-primary";
    logout.addEventListener("click", this.logout);
    div2.appendChild(logout);
    logout.innerHTML = "Logout";
    userContainer.appendChild(div2);
    userContainer.appendChild(div);

    main.appendChild(userContainer);

    console.log(items);
    this.createMarket(items);
  }
}
