import {Component} from '@angular/core';

import {App, NavController, Platform, ToastController, ViewController} from 'ionic-angular';

import {Camera, CameraOptions} from '@ionic-native/camera';

import {Diagnostic} from "@ionic-native/diagnostic";

import {CameraPreview, CameraPreviewOptions} from '@ionic-native/camera-preview';
import Croppr from 'croppr';

import {ImageReading} from '../image-reading/image-reading';
import {SavedImages} from "../saved-images/saved-images";
// import { File } from "@ionic-native/file";
// import {Storage} from '@ionic/storage';
// import { StorageService } from "../components/storage.service";
import { normalizeURL } from 'ionic-angular';

@Component({
    selector: 'camera-page',
    templateUrl: 'camera-page.html',
    providers: [[Camera, Diagnostic, CameraPreview]]
})

export class CameraPage {
    nav: any;
    picture: any;
    flashMode: boolean = false;
    flash: any = {
        on: false,
        off: false,
        auto: true
    };
    image: any;
    croppr: any;
    canvas: any;
    context: any;

    constructor(public navCtrl: NavController, public toastCtrl: ToastController, private diagnostic: Diagnostic,
                private preview: CameraPreview, private platform: Platform,
                public app: App, private viewCtrl: ViewController, private camera: Camera) {

        this.platform.ready().then(() => {
            this.nav = app._appRoot._getActivePortal() || app.getActiveNavs()[0];

            this.checkPermissions();

            let lastTimeBackPress = 0;
            let timePeriodToExit = 2000;
            this.platform.registerBackButtonAction(() => {

                let activeView = this.nav.getActive();

                if ((activeView.name == 'CameraPage' || activeView.name == 'BarcodeQR') && this.nav.canGoBack()) {
                    preview.stopCamera();
                    navCtrl.pop();
                } else if (activeView.name == 'CameraPage' && !this.nav.canGoBack()) {
                    if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                        preview.stopCamera();
                        this.platform.exitApp(); //Exit from app
                    } else {
                        let toast = this.toastCtrl.create({
                            message: 'Tap Back again to close the application.',
                            duration: 2000,
                            position: 'bottom',
                        });
                        toast.present();
                        lastTimeBackPress = new Date().getTime();
                    }
                } else if (this.nav.canGoBack()) {
                    navCtrl.pop();
                } else if (!this.nav.canGoBack()) {
                    if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                        preview.stopCamera();
                        this.platform.exitApp(); //Exit from app
                    } else {
                        let toast = this.toastCtrl.create({
                            message: 'Tap Back again to close the application.',
                            duration: 2000,
                            position: 'bottom',
                        });
                        toast.present();
                        lastTimeBackPress = new Date().getTime();
                    }
                }

            });
        });

    }

    initializePreview() {
        let previewRect: CameraPreviewOptions = {
            x: 0,
            y: 60,
            width: window.innerWidth,
            height: window.innerHeight - 150,
            camera: 'rear',
            tapPhoto: false,
            toBack: true
        };

        // Start preview
        this.preview.startCamera(previewRect);
    }

    checkPermissions() {
        this.diagnostic.isCameraAuthorized().then((authorized) => {
            if (authorized)
                this.initializePreview();
            else {
                this.diagnostic.requestCameraAuthorization().then((status) => {
                    if (status == this.diagnostic.permissionStatus.GRANTED)
                        this.initializePreview();
                    else {
                        this.toastCtrl.create(
                            {
                                message: "Cannot access camera",
                                position: "bottom",
                                duration: 5000
                            }
                        ).present();
                    }
                });
            }
        });
    }

    public takePicture() {
        console.log('start takepicture')
        document.querySelector('#camera-btn-overlay').className = 'pressed';
        document.querySelector('#crop-wrapper').className += ' with-shadow';
        setTimeout(() => {
            document.querySelector('#camera-btn-overlay').className = '';
        }, 175);


        let pictureOptions = {};

        if (this.platform.is('ios')) {
            pictureOptions = {
                quality: 100,
                // destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL
                //sourceType: this.camera.PictureSourceType.CAMERA,
                //destinationType: this.camera.DestinationType.FILE_URI,
                //encodingType: this.camera.EncodingType.JPEG,
                //mediaType: this.camera.MediaType.PICTURE
                width: window.screen.width * 0.6,
                height: window.screen.height * 0.6
            };
        } else {
            pictureOptions = {
                quality: 100,
                // sourceType: this.camera.PictureSourceType.CAMERA,
                destinationType: this.camera.DestinationType.DATA_URL,
                // encodingType: this.camera.EncodingType.JPEG,
                // mediaType: this.camera.MediaType.PICTURE
            };
        }
        // console.log(this.platform.is('android'));
        //
        // if(this.platform.is('android')) {
        //     console.log('android')
        //     pictureOptions.destinationType = this.camera.DestinationType.FILE_URI;
        // } else
        // if(this.platform.is('ios')) {
        //     pictureOptions.destinationType = this.camera.DestinationType.NATIVE_URI;
        // } else {
        //     pictureOptions.destinationType = this.camera.DestinationType.DATA_URL;
        // }

        this.preview.takePicture(pictureOptions).then((imageData) => {
            console.log(imageData);
            console.log('tap take a picture')
            if (this.platform.is('ios')) {
                console.log('I am an ios device')
                //this.image = this.cropping(normalizeURL(imageData));
                this.image = 'data:image/jpeg;base64,' + imageData;
            } else {
                console.log('I am an another device')
                this.image = 'data:image/jpeg;base64,' + imageData;
                
            }

            setTimeout(() => {

                this.croppr = new Croppr('#croppr', {
                    startSize: [80, 80, '%']
                });

                //this.picture = this.cropImg();
                if (this.platform.is('ios')) {
                    this.picture = this.image;
                    //this.picture = this.cropImg();
                } else {
                    this.picture = this.cropImg();
                }

                this.preview.stopCamera();
                console.log('stop camera')
                // let blueCircle = document.createElement("DIV");
                // let imageClipped = document.getElementsByClassName('croppr-imageClipped')[0];
                // let imageClippedContainer = document.getElementsByClassName('croppr')[0];
                // blueCircle.className = 'blue-circle';

                // imageClippedContainer.insertBefore(blueCircle, imageClipped);


                // document.querySelector('#crop-wrapper').className += ' without-shadow';

                // document.querySelector('ion-header#camera-header').setAttribute('style', 'z-index: -1 !important');

                // document.querySelector('ion-header#camera-header .close-camera').setAttribute('style', 'z-index: -1 !important');

                // document.querySelector('ion-content#camera-content').setAttribute('style', 'overflow: auto');

                // document.querySelector('ion-content#camera-content .scroll-content').setAttribute('style', 'overflow: auto');

                // document.querySelector('ion-content#camera-content .scroll-content').setAttribute('style', 'padding: 60px 0 90px');

                // document.querySelector('ion-content#camera-content .fixed-content').setAttribute('style', 'overflow: auto');

                // document.querySelector('ion-content#camera-content .fixed-content').setAttribute('style', 'padding: 60px 0 90px;');

                // document.querySelector('ion-footer#camera-footer').setAttribute('style', 'z-index: -1 !important');


                // blueCircle.className += ' big-circle';

                // document.getElementById('camera-crop-img').className += ' slide-down';

                setTimeout(() => {
                    this.navCtrl.push(ImageReading, {picture: this.picture}, { animation: 'fade-transition', direction: 'forward' }).then(() => {
                        const index = this.viewCtrl.index;
                        this.nav.remove(index);
                    });
                }, 2000);
            }, 0);


        }, (err) => {
            console.log(err)
        });

    }

    cropImg() {
        // let value = this.croppr.getValue();
        // this.cropService.sendCroppedCoordinates(value);
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');


        let imgSource = new Image();
        imgSource.src = this.image;

        return this.cropping(imgSource);
    }

    cropping(input) {
        console.log('start cropping')
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let cropped = this.croppr.getValue();
        this.canvas.width = cropped.width;
        this.canvas.height = cropped.height;

        this.context.drawImage(input, cropped.x, cropped.y, cropped.width, cropped.height, 0, 0, this.canvas.width, this.canvas.height);

        let canvasOverlay = document.createElement("img");
        canvasOverlay.id = "camera-crop-img";
        canvasOverlay.src = this.canvas.toDataURL();
        let body = document.getElementsByTagName('body')[0];
        let script = document.querySelector('body script')[0];

        body.insertBefore(canvasOverlay, script);
        console.log('start cropping')
        return this.canvas.toDataURL();
    }

    public seeGallery(event) {
        let options = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL
        };

        this.camera.getPicture(options)
            .then((imageData) => {
                if (this.platform.is('ios')) {

                    console.log('Gallery: '+ imageData)
                    this.picture = normalizeURL(imageData);
                } else {
                    this.picture = 'data:image/jpeg;base64,' + imageData;
                }
                this.preview.stopCamera();
                this.navCtrl.push(ImageReading, {picture: this.picture}).then(() => {
                    const index = this.viewCtrl.index;
                    this.nav.remove(index);
                });
            }, (err) => {
                this.picture = "";
            });
    }

    public chooseFlashMode() {
        this.flashMode = !this.flashMode;
    }

    public changeFlashMode(mode) {
        if (mode == 'auto') {
            this.flash.auto = true;
            this.flash.on = false;
            this.flash.off = false;
            this.preview.setFlashMode('on');
        } else if (mode == 'on') {
            this.flash.on = true;
            this.flash.off = false;
            this.flash.auto = false;
            this.preview.setFlashMode('off');
        } else if (mode == 'off') {
            this.flash.off = true;
            this.flash.on = false;
            this.flash.auto = false;
            this.preview.setFlashMode('auto');
        }

        this.flashMode = false;
    }

    public closeCamera() {
        this.preview.stopCamera();
        this.navCtrl.push(SavedImages).then(() => {
            const index = this.viewCtrl.index;
            this.nav.remove(index);
        });
    }
}
