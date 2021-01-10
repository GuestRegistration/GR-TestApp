const countries = require('../countries.json');

const helper = {
    getCountryByKey: (key, value) => {
        return countries.find(country => country[key] == value);
    }
};

export default helper;