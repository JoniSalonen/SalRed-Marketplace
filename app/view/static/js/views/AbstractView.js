export default class{

    constructor(params){
        this.params = params;
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

    async build(){
    }

}
