import {Component} from "@angular/core";
import {App, NavController, NavParams, ViewController} from "ionic-angular";

import Croppr from 'croppr';
// import {CropImageService} from "./crop-image.service";
import {ImageReading} from "../image-reading/image-reading";
import {StorageService} from "../components/storage.service";


@Component({
    selector: 'crop-image',
    templateUrl: 'crop-image.html',
    providers: [StorageService]
})

export class CropImage {
    public nav: any;
    image: any;
    croppr: any;
    canvas: any;
    context: any;

    constructor(public navParams: NavParams, public navCtrl: NavController, public app: App, private viewCtrl: ViewController,
    public storageService: StorageService
        // , public cropService: CropImageService
    ) {
        this.nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
        this.image = navParams.get("image");
    }

    ionViewDidLoad() {
        this.croppr = new Croppr('#croppr', {
            startSize: [80, 80, '%']
        });

        let cropprRegion = document.getElementsByClassName('croppr-region')[0];

        cropprRegion.innerHTML += '<div id="croppr-corners">' +
            '<div class="upper-left"></div>' +
            '<div class="upper-right"></div>' +
            '<div class="lower-left"></div>' +
            '<div class="lower-right"></div>' +
            '</div>';
    }

    cropImg() {
        let value = this.croppr.getValue();
        // this.cropService.sendCroppedCoordinates(value);
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');



        let imgSource = new Image();
        imgSource.src = this.image.src;

        let croppedImage = this.cropping(imgSource);

        let that = this;
        if(this.image.storageId && this.image.storageId != ''){
            that.storageService.get('UserSavedImages').then((data) => {
                let images = data;
                that.storageService.remove('UserSavedImages');
                for(let i = 0; i < images.length; i++) {
                    console.log('storage id: ' + images[i].storageId);
                    console.log('img id: ' + that.image.storageId);
                    if(images[i].storageId == that.image.storageId) {
                        console.log('match');
                        images[i].src = croppedImage;
                    } else {
                        console.log('not a match');
                    }
                }
                that.storageService.set('UserSavedImages', images);
            });

            this.navCtrl.push(ImageReading, {value: value, picture: croppedImage, storageId: this.image.storageId})
                .then(() => {
                    const index = this.viewCtrl.index;
                    this.nav.remove(index);
                });

        } else {
            this.navCtrl.push(ImageReading, {value: value, picture: croppedImage})
                .then(() => {
                    const index = this.viewCtrl.index;
                    this.nav.remove(index);
                });
        }


    }

    cropping(input) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let cropped = this.croppr.getValue();
        this.canvas.width = cropped.width;
        this.canvas.height = cropped.height;
        this.context.drawImage(input, cropped.x , cropped.y, cropped.width, cropped.height, 0, 0, this.canvas.width, this.canvas.height);
        return  this.canvas.toDataURL();
    }
}
