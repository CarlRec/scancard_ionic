import { Component } from "@angular/core";
import {App, NavController, ViewController} from "ionic-angular";
import { StorageService } from "../components/storage.service";
import {SignInUpService} from "../sign-in-up/sign-in-up.service";
import { SignInUp } from "../sign-in-up/sign-in-up";



@Component({
    selector: 'account',
    templateUrl: 'account.html',
    providers: [StorageService, SignInUpService]
})

export class Account {
    nav: any;
    signIn: boolean = false;
    name: string = '';
    email: string = '';

    constructor(private navCtrl: NavController, public storageService: StorageService,
                public app: App, private viewCtrl: ViewController, public signService: SignInUpService){

        this.nav = app._appRoot._getActivePortal() || app.getActiveNavs()[0];
        this.storageService.get('token').then((value) => {
            if(value && value != '') {
                this.signService.userInfo(value).subscribe((data) => {
                    if(data && data['user']){
                        this.signIn = true;
                        this.name = data['user'].name;
                        this.email = data['user'].email;
                    } else {
                        this.signIn = false;
                        this.storageService.remove('token');
                    }
                }, (error) => {
                    if(error.error.error == 'token_expired') {
                        this.storageService.remove('token');
                    }
                });
            }
        } );
    }

    navigateTo(view) {
        switch(view){
            case 'signIn':
                this.navCtrl.push(SignInUp).then(() => {
                    const index = this.viewCtrl.index;
                    this.nav.remove(index);
                });
                break;
            case 'signOut':
                this.storageService.remove('token');
                this.storageService.remove('user');
                this.navCtrl.push(SignInUp).then(() => {
                    const index = this.viewCtrl.index;
                    this.nav.remove(index);
                });
                break;
        }
    }

    returnBack() {
        this.navCtrl.pop();
    }
}
