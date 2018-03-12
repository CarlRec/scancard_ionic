import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import {CropImage} from "../crop-image/crop-image";
import {SelectText} from "../select-text/select-text";
import {StorageService} from "../components/storage.service";

@Component({
    selector: 'edit-image',
    templateUrl: 'edit-image.html',
    providers: [StorageService]
})

export class EditImage {
    image: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService){
        this.image = navParams.get("image");
    }

    ionViewWillEnter () {
        this.image = this.navParams.get("image");

        if(this.image.storageId && this.image.storageId != '') {
            if(this.image.storageId && this.image.storageId != '') {
                this.storageService.get('UserSavedImages').then((data) => {
                    let images = data;
                    this.storageService.remove('UserSavedImages');
                    for (let i = 0; i < images.length; i++) {
                        if (images[i].storageId == this.image.storageId) {
                            this.image = images[i];
                        }
                    }
                    this.storageService.set('UserSavedImages', images);
                });
            }
        } else {
            // get image from db with some id to reload
        }
    }

    goToPage(page) {
        switch(page) {
            case 'crop':
                this.navCtrl.push(CropImage, {image: this.image});
                break;
            case 'text':
                this.navCtrl.push(SelectText, {image: this.image});
                break;
        }
    }
}
