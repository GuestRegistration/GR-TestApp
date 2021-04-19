export default class{
    
    fillables = [];

    constructor(model = null){
        this.model = model;
    }

    init(){
        const model = {};
        this.fillables.forEach(field => {
            model[field] = this.model ? this.model[field] : null
        });
        return model;
    }

    clear(){
        const model = {};
        this.fillables.forEach(field => {
            model[field] = null
        });
        return model;
    }
}