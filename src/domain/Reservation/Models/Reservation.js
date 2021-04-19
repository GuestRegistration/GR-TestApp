import Model from '../../../Foundation/Model';

export default class Charge extends Model{
    name = null;
        
    fillables = [
        'name', 'checkin_date', 'checkout_date',  'instruction', 'amount', 'charges'
    ]

    constructor(model = null){
       super(model);
       return this.init();
    }

    charges(){
        return 
    }

}