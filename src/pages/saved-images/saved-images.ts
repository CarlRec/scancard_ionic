import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {ImagePage} from "../image-page/image-page";
import {FilterPipe} from "../components/filter-pipe";
import {StorageService} from "../components/storage.service";
import {ImageReadingService} from "../image-reading/image-reading.service";
import {SignInUpService} from "../sign-in-up/sign-in-up.service";
// import * as AsYouType from "libphonenumber-js";
import {FoundTextService} from "../components/found-text.service";

@Component({
    selector: 'saved-images',
    templateUrl: 'saved-images.html',
    providers: [FilterPipe, StorageService, ImageReadingService, SignInUpService, FoundTextService]
})

export class SavedImages {
    images: any = [];
    pageTitle: string;
    backBtn: boolean;
    folder: boolean = false;
    folderId: number;
    folderDescription: string;
    searchString: string = '';
    searchList: any = ['name'];
    storage: any = [];
    user: any;
    token: string;


    constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService,
                public imageReadingService: ImageReadingService, public signService: SignInUpService, public foundText: FoundTextService) {
        if (navParams.get("folders")) {
            this.folder = true;
            this.backBtn = true;
            this.pageTitle = navParams.get("folderName");
            this.folderId = navParams.get('folderId');
            this.folderDescription = navParams.get('folderDescr');

            // http get folder images where id is folderId
            // this.images = response;
        } else {

            this.storageService.get('token').then((value) => {
                if (value && value != '') {
                    this.token = value;
                    let that = this;
                    this.signService.userInfo(value).subscribe((data) => {
                        if (data && data['user']) {
                            that.user = data['user'];
                            that.imageReadingService.getImages(that.token).subscribe(response => {
                                console.log(response);
                                if(response && response['photos'] && response['photos'].length > 0) {
                                    that.images = response['photos'];
                                    for (let i = 0; i < that.images.length; i++) {
                                        that.images[i] = that.foundText.parseFoundFields(that.images[i]);
                                    }
                                }
                            });
                        }
                    }, (error) => {
                        if(error.error.error == 'token_expired') {
                            this.storageService.remove('token');
                        }
                    });
                }
            });

            // this.images = response;
            this.pageTitle = 'Saved Images';
            this.backBtn = false;
            this.storageService.get('UserSavedImages').then((data) => {
                this.storage = data;
                for(let i = 0;  i < this.storage.length; i++) {
                    this.storage[i] = this.foundText.parseFoundFields(this.storage[i]);
                }
            });
        }

    }

    ionViewWillEnter() {
        this.storageService.get('UserSavedImages').then((data) => {
            if (data) {
                this.storage = data;
                for(let i = 0;  i < this.storage.length; i++) {
                    this.storage[i] = this.foundText.parseFoundFields(this.storage[i]);
                }
            }
        });

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
        })

        // http get folder images where id is folderId
        // this.images = response;
    }

    seeImage(id) {
        for (let i = 0; i < this.images.length; i++) {
            if (this.images[i].id == id) {

                this.navCtrl.push(ImagePage, {imageObj: this.images[i], success: true});
            }
        }
    }

    seeImageFromStorage(id) {
        for (let i = 0; i < this.storage.length; i++) {
            // console.log(' type of img storage id: ' + typeof this.storage[i].storageId);
            // console.log('img storage id: ' + this.storage[i].storageId);
            // console.log('type of see img storage id: ' + typeof id);
            // console.log('see img storage id: ' + id);
            // console.log('match id: ' + (this.storage[i].storageId == id));

            if (this.storage[i].storageId == id) {
                this.navCtrl.push(ImagePage, {imageObj: this.storage[i], success: true});
            }
        }
    }

    getSearchString = function (search) {
        this.searchString = search;
    };

    returnBack() {
        this.navCtrl.pop();
    }

}
