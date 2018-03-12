import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {DomSanitizer} from '@angular/platform-browser';
import {CameraPage} from "../camera-page/camera-page";
import {EditImage} from "../edit-image/edit-image";
import {StorageService} from "../components/storage.service";
import {ImageService} from "./image-page.service";
import {GoogleCloudVisionServiceProvider} from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
import { SocialSharing } from '@ionic-native/social-sharing';
// import * as AsYouType from "libphonenumber-js";
import {FoundTextService} from "../components/found-text.service";
import {SignInUpService} from "../sign-in-up/sign-in-up.service";

@Component({
    selector: 'image-page',
    templateUrl: 'image-page.html',
    providers: [StorageService, ImageService, FoundTextService, SignInUpService]
})

export class ImagePage {
    public image: any;
    public success: boolean;
    // public asd: string;
    // public test: string;
    public input: any = {};
    canvas: any;
    context: any;
    // testShare: any;
    token: string;
    user: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public DomSanitizer: DomSanitizer,
                public storageService: StorageService, public imageService: ImageService,
                private vision: GoogleCloudVisionServiceProvider, private socialSharing: SocialSharing,
                public foundText: FoundTextService, public signService: SignInUpService) {
        this.success = navParams.get("success");

        this.image = this.foundText.parseFoundFields(navParams.get("imageObj"));
    }

    ionViewWillEnter() {
        let that = this;
        if (this.image && this.image.storageId && this.image.storageId != '') {
            that.storageService.get('UserSavedImages').then((data) => {
                let images = data;
                that.storageService.remove('UserSavedImages');
                for (let i = 0; i < images.length; i++) {
                    if (images[i].storageId == that.image.storageId) {
                        that.image = this.foundText.parseFoundFields(images[i]);
                    }
                }
                that.storageService.set('UserSavedImages', images);
            });
        } else {
            // get image from db with some id to reload
        }

        this.storageService.get('token').then((value) => {
            if (value && value != '') {
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
        });
    }

    goToCamera() {
        this.navCtrl.push(CameraPage);
    }

    editImg() {
        this.navCtrl.push(EditImage, {image: this.image});
    }

    shareImage(){
        let msg = '';
        for(let i = 0; i < this.image.call.length; i++) {
            msg += 'Phone: ' + this.image.call[i] + '\n';
        }

        for(let i = 0; i < this.image.email.length; i++) {
            msg += 'Email: ' + this.image.email[i] + '\n';
        }

        for(let i = 0; i < this.image.browse.length; i++) {
            msg += 'Url: ' + this.image.browse[i] + '\n';
        }

        for(let i = 0; i < this.image.map.length; i++) {
            msg += 'Address: ' + this.image.map[i] + '\n';
        }

        let name = (this.image.name && this.image.name != '') ? this.image.name : 'Scannoo image';
        let file = this.cropImg();
        let url = '';
        this.socialSharing.share(msg, name, file, url);
    }

    toFavorites(action) {
        if (action == 'set') {
            this.image.favorite = true;
        } else if (action == 'remove') {
            this.image.favorite = false;
        }

        if (this.image.storageId) {
            this.storageService.get('UserSavedImages').then((data) => {
                let images = data;
                this.storageService.remove('UserSavedImages');
                for (let i = 0; i < images.length; i++) {
                    if (images[i].storageId == this.image.storageId) {
                        images[i] = this.image;
                    }
                }
                this.storageService.set('UserSavedImages', images);
            });
        } else {
            // request to update image
            this.imageService.updateImage(this.image.favorite, this.user.id, this.token).subscribe(response => {
                console.log(response);
            });
        }
    }


    cropImg() {
        this.canvas = document.getElementById('canvas-image');
        this.context = this.canvas.getContext('2d');


        let imgSource = new Image();
        imgSource.src = this.image.src;

        let height = imgSource.height;
        let width = imgSource.width;

        return this.cropping(imgSource, width, height);
    }

    cropping(input, width, height) {
        this.context.clearRect(0, 0, width, height);
        this.canvas.width = width;
        this.canvas.height = height;

        this.context.drawImage(input, 0, 0, width, height, 0, 0, width, height);

        return this.canvas.toDataURL();
    }

    saveContact() {
        let img = this.cropImg();

        this.imageService.contactAPI(img).subscribe(data => {
            console.log(data);
        },(
            error => {

        }
        ));

        // this.vision.getLabels(img).subscribe((result) => {
        //     if (result.responses[0].fullTextAnnotation) {
        //
        //         console.log(result.responses[0].fullTextAnnotation.text);
        //         let document = {
        //             content: result.responses[0].fullTextAnnotation.text,
        //             language: 'EN',
        //             type: 'PLAIN_TEXT'
        //         };
        //
        //         this.imageService.contactAPI(document).subscribe(data => {
        //             this.test = JSON.stringify(data);
        //             console.log(data);
        //         });
        //
        //     }
        // });
    }

}
