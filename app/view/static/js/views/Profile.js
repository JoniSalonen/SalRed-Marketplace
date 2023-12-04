import AbstractItemsView from "./AbstractItemsView.js";

export default class extends AbstractItemsView {
  
    constructor(params){
    super(params);
    this.setTitle("Profile");
    this.needsLogin = true;
  }

  oldCoins(){
    var coinsText = document.getElementById("coins").innerText;
    var coins = coinsText.split(" ")[1];
    return parseInt(coins);
  }

  async getCoins(){ 
    setTimeout(() => {}, 5000);
    await axios.get('/getCoins', {})
      .then(response => {
        if(response.data.status == "error"){
          alert(response.data.message);
        }
        else if(response.data.status == "login"){
          alert("You must be logged in to get coins");
          window.location.href = "/login";
        }
        else{
          var coins = response.data.coins;
          alert("You won " + coins + " coins!");
          var newCoins = this.oldCoins() + coins;
          document.getElementById("coins").innerHTML = "Coins: " + newCoins;
          document.getElementById("profile-coins").innerHTML = "Coins: " + newCoins;
        }
      }).catch(error => {
        console.error('Error:', error);
        alert("Error adding coins");
      });
  }

  async fetchData() {
    var items = null;
    await axios
      .get('/getUserItems?name=' + this.session.name)
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
    //Create container for user info
    var userContainer = document.createElement("div");
    userContainer.className = "container my-5 text-white font-style";

    //Display name
    var name = document.createElement("h1");
    name.innerHTML = this.session.name;
    //Display sales
    var sales = document.createElement("h3");
    sales.innerHTML = "Sales: " + this.session.sales;
    //Display purchases
    var purchases = document.createElement("h3");
    purchases.innerHTML = "Purchases: " + this.session.purchases;
    //Display coins
    var coins = document.createElement("h3");
    coins.id = ("profile-coins")
    coins.innerHTML = "Coins: " + this.session.coins;
    userContainer.appendChild(name);
    userContainer.appendChild(sales);
    userContainer.appendChild(purchases);
    userContainer.appendChild(coins);
    //Create button to add items
    var div = document.createElement("div");
    div.className = "container text-center";
    var button = document.createElement("button");
    button.className = "btn btn-warning";
    button.innerHTML = "Add Item";
    button.setAttribute("data-link", "");
    button.href = "addItem";
    //Create button to get coins
    var coinsbutton = document.createElement("button");
    coinsbutton.className = "btn btn-warning me-3";
    coinsbutton.innerHTML = "Get Coins";
    coinsbutton.addEventListener("click", this.getCoins.bind(this));
    div.appendChild(coinsbutton);
    div.appendChild(button);

    //Create button to logout
    var div2 = document.createElement("div");
    div2.className = "container text-left";
    var logout = document.createElement("button");
    logout.addEventListener("click", this.logout);
    div2.appendChild(logout);
    logout.innerHTML = "Logout";

    //Append logout
    userContainer.appendChild(div2);
    //Append add item and get coins
    userContainer.appendChild(div);

    main.appendChild(userContainer);

    //Display user´s items
    this.createMarket(items);
  }
}
