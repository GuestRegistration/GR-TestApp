import Model from '../../../Foundation/Model';

export default class Charge extends Model{
    fillables = [
        'title', 'description', 'type',  'enable', 'amount'
    ]

    constructor(model = null){
       super(model);
       return this.init();
    }
}