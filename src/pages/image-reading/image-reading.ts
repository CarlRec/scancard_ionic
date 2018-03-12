import {Component} from "@angular/core";
import {App, NavController, NavParams, ViewController} from "ionic-angular";
import {DomSanitizer} from '@angular/platform-browser';
// import {ImageReadingService} from "./image-reading.service";
// import {CropImageService} from "../crop-image/crop-image.service";

import {ImagePage} from "../image-page/image-page";
import {GoogleCloudVisionServiceProvider} from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
import {StorageService} from "../components/storage.service";
import {SignInUpService} from "../sign-in-up/sign-in-up.service";
import {ImageReadingService} from "./image-reading.service";
// import { FoundTextService } from "../components/found-text.service";
// import * as AsYouType  from 'libphonenumber-js';


@Component({
    selector: 'image-reading',
    templateUrl: 'image-reading.html',
    providers: [StorageService, SignInUpService, ImageReadingService]
})


export class ImageReading {
    public nav: any;
    public reading: string = 'Reading';
    public image: any;
    public cropValue: any;
    public storageId: any;
    public response: any;
    user: any;
    token: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public DomSanitizer: DomSanitizer, public app: App, private viewCtrl: ViewController,
                private vision: GoogleCloudVisionServiceProvider, public storageService: StorageService, public signService: SignInUpService,
                public imageReadingService: ImageReadingService) {
        this.nav = this.app._appRoot._getActivePortal() || this.app.getActiveNavs()[0];
        // this.storageService.clear();

        if (!navParams.get("value")) {
            this.image = navParams.get("picture");

            let that = this;

            setTimeout(function () {
                let elem = document.getElementById('camera-crop-img');
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }
                document.getElementById('text-icon-wrapper').className += ' animation-ended';
                that.processImage(that.image);
            }, 3000);
        } else {
            this.image = navParams.get("picture");
            this.cropValue = navParams.get("value");
            if(navParams.get("storageId")) {
                this.storageId = navParams.get("storageId");
            }

            this.reading = 'Cropping';
            this.cropLoading();
        }

    }

    ionViewWillEnter() {
        this.storageService.get('token').then((value) => {
            console.log(value);
            if(value && value != '') {
                this.token = value;
                this.signService.userInfo(value).subscribe((data) => {
                    if (data && data['user']) {
                        this.user = data['user'];
                    }
                }, (error) => {
                    if(error.error.error == 'token_expired') {
                        this.storageService.remove('token');
                    }
                });
            }
        })
    }

    processImage(img) {

        this.response = {
            src: img,
            favorite: false
        };

        let that = this;
        this.vision.getLabels(img).subscribe((result) => {
            if(result.responses[0].fullTextAnnotation) {
                that.response.query = result.responses[0].fullTextAnnotation.text;
            }
            that.response.name = '';


            if(this.user && this.token) {
                this.imageReadingService.sendImage(this.response, this.token).subscribe(response => {
                    this.reading = 'Read.';
                    document.getElementById('dots-wrapper').style.display = 'none';

                    setTimeout(() => {
                        this.navCtrl.push(ImagePage, {imageObj: this.response, success: true})
                            .then(() => {
                                const index = this.viewCtrl.index;
                                this.nav.remove(index);
                            });

                    }, 1000);
                });
            } else {
                that.storageService.get('UserSavedImages').then((data) => {

                    if (data) {
                        let images = data;
                        that.storageService.remove('UserSavedImages');

                        that.response.storageId = images[images.length - 1].storageId + 1;

                        images.push(that.response);
                        that.storageService.set('UserSavedImages', images);
                    } else {
                        let savedImgs: Array<any> = [];
                        that.response.storageId = 1;

                        savedImgs.push(that.response);
                        that.storageService.set('UserSavedImages', savedImgs);
                    }

                    this.reading = 'Read.';
                    document.getElementById('dots-wrapper').style.display = 'none';

                    setTimeout(() => {
                        this.navCtrl.push(ImagePage, {imageObj: this.response, success: true})
                            .then(() => {
                                const index = this.viewCtrl.index;
                                this.nav.remove(index);
                            });

                    }, 1000);

                }, () => {

                });

            }


        }, err => {
            // console.log(err.error.error.message);
        });

    }

    cropLoading() {
        // this.cropService.sendCroppedCoordinates(this.cropValue).subscribe(response => {
        //     this.response = response;
        // this.reading = 'Cropped.';
        // document.getElementById('dots-wrapper').style.display = 'none';
        //
        // setTimeout(function(){
        //   this.navCtrl.pop();
        // }, 1000);
        // }, (error: HttpErrorResponse) => {
        //
        // });

        this.vision.getLabels(this.image).subscribe((result) => {

            if(this.storageId) {
                this.storageService.get('UserSavedImages').then((data) => {
                    let images = data;
                    this.storageService.remove('UserSavedImages');
                    for (let i = 0; i < images.length; i++) {
                        if (images[i].storageId == this.storageId) {
                            images[i].query = result.responses[0].fullTextAnnotation.text;
                        }
                    }
                    this.storageService.set('UserSavedImages', images);
                });
            }

            this.reading = 'Cropped.';
            document.getElementById('dots-wrapper').style.display = 'none';

            setTimeout(() => {
                this.navCtrl.pop();
            }, 1000);

        }, err => {
            // console.log(err.error.error.message);
        });


        // setTimeout(() => {
        //     this.reading = 'Cropped.';
        //     document.getElementById('dots-wrapper').style.display = 'none';
        //
        //     setTimeout(() => {
        //         this.navCtrl.pop();
        //     }, 1000);
        // }, 5000);
    }

}
