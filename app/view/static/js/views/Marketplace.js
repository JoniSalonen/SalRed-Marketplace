import AbstractItemsView from "./AbstractItemsView.js";

export default class extends AbstractItemsView {

    constructor(params){
        super(params);
        this.setTitle("Marketplace");
    }

    
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
    async build(){
        await super.build();
        
        var items = null;
        items = await this.fetchData();
        
        this.createMarket(items);
    }

}