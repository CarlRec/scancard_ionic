import {Injectable} from "@angular/core";
import * as AsYouType from "libphonenumber-js";

@Injectable()
export class FoundTextService {
    urlRegex: any = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|ftp:\/\/|file:\/\/|www\.)?[a-z0-9]+([\-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ig;
    urlRegexMatch: any = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|ftp:\/\/|file:\/\/|www\.)?[a-z0-9]+([\-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/;
    emailRegex: any = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/g;
    emailRegexMatch: any = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/;
    phoneRegex: any = /((([0-9])?(\+)?(\()?)+(([0-9])?(\ )?(\+)?(\()?(\.)?(\))?(\-)?)*){6,}/;

    addressRegex: any = /\d+[ ]?(?:[A-Za-z0-9#,.-\s]+[ ]?)+[ ](?:[A-Z][a-z,.-\s]+[ ]?)+(?:AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY) \b\d{5}(?:-\d{4})?\b/;
    stateAbbreviationsRegex: any = /AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|TX|UT|VT|VI|VA|WA|WV|WI|WY/;
    stateRegex: any = /Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New[ ]Hampshire|New[ ]Jersey|New[ ]Mexico|New[ ]York|North[ ]Carolina|North[ ]Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode[ ]Island|South[ ]Carolina|South[ ]Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West[ ]Virginia|Wisconsin|Wyoming/;
    zipcodeRegex: any = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    streetNumberRegex: any = /^\d+$/
    constructor() {

    }

    checkURL(string) {
        return this.urlRegex.test(string);
    }

    getURLmatches(string) {
        let str = string.toString();
        let regex = new RegExp(this.urlRegexMatch, 'ig');

        let strArray = str.match(regex);

        return strArray;
    }

    checkEmail(string) {
        return this.emailRegex.test(string);
    }

    getEmailMatches(string) {
        let str = string.toString();
        let regex = new RegExp(this.emailRegexMatch, 'ig');

        let strArray = str.match(regex);

        return strArray;
    }

    checkStateAddress(string) {
        if (this.stateAbbreviationsRegex.test(string) || this.stateRegex.test(string)){
            return true
        }
        return false;
    }
    
    checkZipCode(string) {
        return this.zipcodeRegex.test(string);
    }
    getMatches(string) {
        let str = string.toString();
        let regex = new RegExp(this.phoneRegex, 'ig');

        let strArray = str.match(regex);


        // let test = new RegExp(this.addressRegex, 'ig');
        //
        // let testArr = str.match(test);
        // console.log('testArr');
        // console.log(testArr);

        return strArray;
    }

    parseFoundFields(imageObj) {
        imageObj.call = [];
        imageObj.browse = [];
        imageObj.email = [];
        imageObj.map = [];

        let textArray = imageObj.query.split(/\s+/);
        console.log(textArray)
        for (let k = 0; k < textArray.length; k++) {
            if (this.checkURL(textArray[k])) {
                imageObj.browse.push(textArray[k]);
            }

            if (this.checkEmail(textArray[k])) {
                imageObj.email.push(textArray[k]);
            }

            if (this.checkStateAddress(textArray[k])) {
                // at first check state
                console.log(textArray[k])
                if (k + 1 >= textArray.length){
                    continue;   
                }
                console.log("zipcode = " + textArray[k + 1])
                // next of state will be zipcode
                if (this.checkZipCode(textArray[k + 1])){
                    console.log("this is address")
                    // first string of address will be Addressee's name
                    for (let m = k - 4; m > k - 10; m--){// k-1, k-2, k-3 th thing is street name city name
                        if (m < 0){
                            break
                        }

                        if (this.streetNumberRegex.test(textArray[m])){
                            var map = ''
                            for (let i = m; i <= k + 1; i++){
                                if (i != m){
                                    map = map + ' '
                                }
                                map = map + textArray[i]
                            }
                            imageObj.map.push(map);
                            break
                        }     
                    }    
                }
                
            }
        }

        let resultArray = this.getMatches(imageObj.query) || [];

        for (let j = 0; j < resultArray.length; j++) {
            if (AsYouType.isValidNumber(resultArray[j], 'US') === true) {
                imageObj.call.push(resultArray[j]);
            }
        }

        imageObj.results = imageObj.call.length + imageObj.browse.length
            + imageObj.email.length
            + imageObj.map.length;

        return imageObj;
    }
}
