import { Component } from "@angular/core";
import {NavController} from "ionic-angular";
import {StorageService} from "../components/storage.service";
import {AddFolderService} from "./add-folder.service";

@Component({
    selector: 'add-folder',
    templateUrl: 'add-folder.html',
    providers: [StorageService, AddFolderService]
})

export class AddFolder {
    folder: any = {
        name: '',
        description: '',
        featured: false
    };
    showErrors: boolean = false;

    constructor(public navCtrl: NavController, public storageService: StorageService,
                public addFolderService: AddFolderService){

    }

    sendFolder(form){
        if(form.valid){
            this.showErrors = false;

            let folder = {
                name: this.folder.name,
                description: this.folder.description
            };

            if(this.folder.featured) {
                folder['featured'] = 1;
            } else {
                folder['featured'] = 0;
            }

            let form_data = Object.keys(folder).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(folder[key]);
            }).join('&');
            this.storageService.get('token').then((value) => {
                   this.addFolderService.saveFolder(form_data, value).subscribe(data => {
                       if(data['status'] == 'success'){
                           this.navCtrl.pop();
                       }
                   });
            });
        } else {
            this.showErrors = true;
        }
    }

    returnBack() {
        this.navCtrl.pop();
    }
}
