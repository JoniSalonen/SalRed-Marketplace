import AbstractItemsView from "./AbstractItemsView.js";

export default class extends AbstractItemsView {
  
    constructor(params){
    super(params);
    this.setTitle("User Profile");

  }

  checkUser(){
    return this.session != null && this.session.name == this.params.name;
  }

  async fetchData() {
    var items = null;
    await axios
      .get('/getUserItems?name=' + this.params.name)
      .then((response) => {
        items = response.data
      })
      .catch(error => {
        console.error('Error:', error);
      });
    return items;
    }

    async fetchUser() {
        var user = null;
        await axios
            .get('/getUser?name=' + this.params.name)
            .then((response) => {
                if(response.data.status == "error"){
                    alert("Error getting user");
                    window.location.href = "/";
                }
                else{
                    user = response.data.user
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        return user;
    }

  //Override
  async build() {
    await super.build();

    if(this.checkUser()){
      window.location.href = "/profile";
      return;
    }
    var items = null;
    var user = null;
    user = await this.fetchUser();
    items = await this.fetchData();

    var main = document.getElementById("main");

    //Container to display user info
    var userContainer = document.createElement("div");
    userContainer.className = "container my-5 text-white font-style";
    //Username
    var name = document.createElement("h1");
    name.innerHTML = user.name;
    //Sales
    var sales = document.createElement("h3");
    sales.innerHTML = "Sales: " + user.sales;
    //Purchases
    var purchases = document.createElement("h3");
    purchases.innerHTML = "Purchases: " + user.purchases;
    userContainer.appendChild(name);
    userContainer.appendChild(sales);
    userContainer.appendChild(purchases);

    main.appendChild(userContainer);

    //Display user´s items
    this.createMarket(items, null);
  }
}
