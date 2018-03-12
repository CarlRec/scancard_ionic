import { Component } from "@angular/core";
import { SavedImages } from "../saved-images/saved-images";
import { NavController } from "ionic-angular";

import {FilterPipe} from "../components/filter-pipe";

import {AddFolderService} from "../add-folder/add-folder.service";
import {StorageService} from "../components/storage.service";
import {SignInUpService} from "../sign-in-up/sign-in-up.service";

import {AddFolder} from "../add-folder/add-folder";
import {SignInUp} from "../sign-in-up/sign-in-up";

@Component({
    selector: 'folders',
    templateUrl: 'folders.html',
    providers: [FilterPipe, AddFolderService, StorageService, SignInUpService]
})

export class Folders {
    folders: any = [];

    folderSearch: string;
    searchParam: any = ['name'];
    loggedIn: boolean = false;
    count: number = 0;

    constructor(public navCtrl: NavController, public storageService: StorageService,
                public addFolderService: AddFolderService, public signService: SignInUpService){

    }


    ionViewWillEnter() {
        this.storageService.get('token').then((value) => {
            if(value && value != '') {
                this.signService.userInfo(value).subscribe((data) => {
                    if (data && data['user']) {
                        this.loggedIn = true;
                        this.addFolderService.getFolders(value).subscribe(data => {
                            this.folders = data['folders'];
                        });
                    }
                }, (error) => {
                    if(error.error.error == 'token_expired') {
                        this.storageService.remove('token');
                    }
                });
            }
        })
    }


    goToAddFolder() {
        if(this.loggedIn) {
            this.navCtrl.push(AddFolder);
        } else {
            this.navCtrl.push(SignInUp, {toAddFolder: true});
        }
    }

    viewFolder(id) {
        for(let i = 0; i < this.folders.length; i++) {
            if (this.folders[i].id == id) {
                this.navCtrl.push(SavedImages,
                    {
                        folders: true,
                        folderName: this.folders[i].name,
                        folderId: this.folders[i].id,
                        folderDescr: this.folders[i].description
                    });
            }
        }
    }

    getFolderSearchString = function(search){
        this.count++;
        this.folderSearch = search;
    };
}
