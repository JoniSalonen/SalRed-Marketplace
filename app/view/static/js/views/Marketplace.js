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

    async searchByTitle(){
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

        var container = document.getElementById('dynamic-container');
        var inputGroup = document.createElement('div');
        var input = document.createElement('input');
        var button = document.createElement('button');
        inputGroup.classList.add('input-group');
        input.classList.add('form-control');
        button.classList.add('btn', 'btn-warning');
        input.type = 'text';
        input.placeholder = 'Enter title...';
        button.innerHTML = 'Search';

        button.addEventListener('click', this.searchByTitle);

        inputGroup.appendChild(input);
        inputGroup.appendChild(button);
        container.appendChild(inputGroup);

        div.id = "market";
        div.className = "container";

        main.appendChild(container);
        main.appendChild(div);
        
        this.createMarket(items, div);
    }

}