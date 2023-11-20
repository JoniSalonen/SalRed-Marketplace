export default class{

    constructor(params){
        this.params = params;
        this.session = null;
        this.needsLogin = false;
        this.sessionForbidden = false;
    }

    setTitle(title){
        document.title = title;
    }

    //Function provided by ChatGPT
    //Reset the main div from previous view
    resetMain(){
        const parentElement = document.getElementById("main");

        while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
        }
    }

    //Check if the user is logged in
    async setSession(){
        await axios.get('/getSession')
            .then(response => {
                if(response.data.status == "ok"){
                    this.session = response.data.user;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async build(){
        this.resetMain();
        if(this.session != null){
            var coins = document.getElementById("coins");
            coins.innerHTML = "Coins: " + this.session.coins;
        }
    }

}
