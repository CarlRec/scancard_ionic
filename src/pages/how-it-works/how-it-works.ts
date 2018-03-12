import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

@Component({
    selector: 'how-it-works',
    templateUrl: 'how-it-works.html'
})

export class HowItWorks {

    constructor(private navCtrl: NavController) {

    }

    returnBack() {
        this.navCtrl.pop();
    }
}
