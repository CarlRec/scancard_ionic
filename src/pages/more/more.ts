import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Account } from "../account/account";
import { HowItWorks } from "../how-it-works/how-it-works";
import {BarcodeQR} from "../barcode-qr/barcode-qr";

@Component({
    selector: 'more',
    templateUrl: 'more.html'
})

export class More {
    signInOut: string = 'Sign in';

    constructor(private navCtrl: NavController){

        // if logged in
        // this.signInOut = 'Sign out';
    }

    navigateTo(view) {
        switch(view){
            case 'account':
                this.navCtrl.push(Account);
                break;
            case 'HowItWorks':
                this.navCtrl.push(HowItWorks);
                break;
            case 'barcode':
                this.navCtrl.push(BarcodeQR);
                break;
            // case 'settings':
            //     this.navCtrl.push(Settings);
            //     break;
        }
    }
}
