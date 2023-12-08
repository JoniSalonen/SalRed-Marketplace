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
    
    async searchByTitle(parent){
        var input = document.querySelector('.form-control').value;
        var items = null;
        await axios.get('/searchByTitle?title=' + input)
            .then(response => {
                items = response.data;
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Please try again later");
                return;
            });
        var main = document.getElementById("main");
        var div = document.getElementById("market");
        if(div != null){
            main.removeChild(div);
        }
        div = document.createElement("div");
        div.id = "market";
        div.className = "container";
        main.appendChild(div);
        this.createMarket(items, div);
    }

    //Override
    async build(){
        await super.build();
        
        var items = null;
        items = await this.fetchData();
        var main = document.getElementById("main");
        var div = document.createElement("div");

        var inputGroup = document.createElement('div');
        div.className = "container-fluid";
        var input = document.createElement('input');
        input.className = "font-style";
        var button = document.createElement('button');
        button.className = "font-style text-dark";
        inputGroup.classList.add('input-group');
        input.classList.add('form-control');
        button.classList.add('btn', 'btn-warning');
        input.type = 'text';
        input.placeholder = 'Enter title...';
        button.innerHTML = 'Search';

        button.addEventListener('click', this.searchByTitle.bind(this));

        inputGroup.appendChild(input);
        inputGroup.appendChild(button);

        div.id = "market";
        div.className = "container";

        main.appendChild(inputGroup);
        main.appendChild(div);
        
        this.createMarket(items, div);
    }

}