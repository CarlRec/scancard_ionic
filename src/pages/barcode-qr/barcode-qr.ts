import {Component} from "@angular/core";
import { NavController} from 'ionic-angular';
// import {NgxZxingModule} from 'ngx-zxing';
import {Diagnostic} from "@ionic-native/diagnostic";
import * as AsYouType from "libphonenumber-js";
import {FoundTextService} from "../components/found-text.service";


@Component({
    selector: 'barcode-qr',
    templateUrl: 'barcode-qr.html',
    providers: [[Diagnostic, FoundTextService]]
})

export class BarcodeQR {
    camStarted: boolean = false;
    selectedDevice: any = undefined;
    smallVideo: string = 'small-video';
    qrResult: any = "";
    showResult: boolean = false;
    availableDevices: any = [];
    qrOverlay: boolean = true;
    processedResult: any = {};



    constructor(public navCtrl: NavController, public foundText: FoundTextService) {

    }

    returnBack() {
        this.smallVideo = 'small-video';
        this.camStarted = false;
        this.navCtrl.pop();
    }

    displayCameras(cams: any[]) {
        this.availableDevices = cams;

        console.log("Devices", cams);
        if (cams && cams.length > 0) {
            if (cams[1]) {
                this.selectedDevice = cams[1];
            } else {
                this.selectedDevice = cams[0];
            }

            this.camStarted = true;
            // this.smallVideo = 'small-video open';
            // this.qrOverlay = false;


            setTimeout(() => {
                this.smallVideo = 'small-video open';
                this.qrOverlay = false;
            }, 1000);

        }
    }

    newScan() {
        this.qrResult = '';
        this.processedResult = {
            phones: [],
            emails: [],
            urls: [],
            addresses: []
        };

        this.showResult = false;
        this.camStarted = true;
        setTimeout(() => {
            this.smallVideo = 'small-video open';
            this.qrOverlay = false;
        }, 1000);

    }


    handleQrCodeResult(result: string) {
        this.qrResult = result;

        this.processedResult = {
            phones: [],
            emails: [],
            urls: [],
            addresses: []
        };


        this.processedResult.urls = this.foundText.getURLmatches(result) || [];
        this.processedResult.emails = this.foundText.getEmailMatches(result) || [];


        let resultArray = this.foundText.getMatches(result) || [];

        for (let j = 0; j < resultArray.length; j++) {
            if (AsYouType.isValidNumber(resultArray[j], 'US') === true) {
                this.processedResult.phones.push(resultArray[j]);
            }
        }

        setTimeout(() => {
            this.camStarted = false;
            this.smallVideo = 'small-video';
            this.showResult = true;
        }, 1000);

    }


}
