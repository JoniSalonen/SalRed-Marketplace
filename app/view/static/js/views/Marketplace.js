import AbstractItemsView from "./AbstractItemsView.js";

export default class extends AbstractItemsView {

    constructor(params){
        super(params);
        this.setTitle("Marketplace");
    }

    /**
     * This is a function to fetch data from the database
     * asynchronously.
     * Remember that you must define the route in server.js
     */
    async fetchData() {
        var items = null;
        await axios.get('/getItems')
            .then(response => {
                items = response.data;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        return items;
    }
    //Override
    /**
     * This is the function that builds the view.
     * Once you have the data you can create the html elements
     * accessing main
     */
    async build(){
        await super.build();

        var items = null;
        items = await this.fetchData();
        
        this.createMarket(items);
    }

}