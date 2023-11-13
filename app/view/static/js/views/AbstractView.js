export default class{

    constructor(params){
        this.params = params;
        this.session = null;
    }

    setTitle(title){
        document.title = title;
    }

    resetMain(){
        const parentElement = document.getElementById("main");

        while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
        }
    }

    async setSession(){
        await axios.get('/getSession')
            .then(response => {
                console.log(response.data);
                if(response.data.status == "ok"){
                    this.session = response.data.user;
                    var coins = document.getElementById("coins");
                    coins.innerHTML = "Coins: " + this.session.coins;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async build(){
        
    }

}
