<template>
    <div>
        <vue-tel-input 
            :valid-characters-only="true"
            @input="onPhoneInput"
            v-model="phone.number.significant"
            :defaultCountry="defaultCountry"
        ></vue-tel-input>
    </div>    
</template>
<script>
import countryHelper from '../../helper/country';
import { VueTelInput } from 'vue-tel-input';
export default {
    name: "PhoneNumber",
    components: {
        VueTelInput
    },
    props: {
        value: {
            type: Object,
            default: () =>  ({
                country_code: '',
                international: '',
                significant: '',
            })
        },
    },
    data(){
        return {
            phone: {
                country: {
                    dialCode: ''
                },
                number: {
                    international: '',
                    significant: '',
                }
            },
            phoneRaw: null,
        }
    },
    computed: {
        
        defaultCountry(){
            const country = countryHelper.getCountryByKey('dial_code',  `+${this.phone.country.dialCode}`);
            return country ? country.code : null;
        },
    },

    methods: {
        onPhoneInput(formattedNumber, { number, valid, country }) {
            this.phoneRaw = { number, valid, country };
            this.$emit('input', {
                dialCode: country.dialCode,
                international: number.international,
                significant: number.significant,
                valid
            });
        },
    },

    watch: {
        value: {
            immediate: true,
            handler(phone){
                if(!this.phoneRaw && phone) {
                    this.phone = {
                        country: {
                            dialCode: phone.country_code
                        },
                        number: {
                            international: phone.international,
                            significant: phone.significant,
                        }
                    }

                    return;
                }

                if(this.phoneRaw){
                    this.phone = {
                        country: {
                            dialCode: this.phoneRaw.country.dialCode
                        },
                        number: {
                            international: this.phoneRaw.number.international,
                            significant: this.phoneRaw.number.significant
                        }
                    }
                }
                
            }
        }
    }
}
</script>