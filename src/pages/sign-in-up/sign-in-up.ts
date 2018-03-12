import {Component} from "@angular/core";
import {App, NavController, NavParams, ViewController} from "ionic-angular";
import {SignInUpService} from "./sign-in-up.service";
import {StorageService} from "../components/storage.service";
import {Account} from "../account/account";
import {AddFolder} from "../add-folder/add-folder";


@Component({
    selector: 'sign-in-up',
    templateUrl: 'sign-in-up.html',
    providers: [SignInUpService, StorageService]
})

export class SignInUp {
    nav: any;
    loginPage: boolean = true;
    showErrorsLogin: boolean = false;
    showErrorsRegister: boolean = false;
    isActiveToggleTextPasswordLogin: boolean = true;
    isActiveToggleTextPasswordRegister: boolean = true;
    errors: any = {
        loginError: false,
        registerError: false,
        userError: false
    };
    // loginError: boolean = false;
    loginCredentials: any = {
        email: '',
        password: ''
    };
    // registerError: boolean = false;
    registerCredentials: any = {
        name: '',
        email: '',
        password: ''
    };
    fromAddFolder: boolean = false;

    constructor(private navCtrl: NavController, public app: App, public signService: SignInUpService,
                public storageService: StorageService, private viewCtrl: ViewController, public navParams: NavParams) {
        this.nav = app._appRoot._getActivePortal() || app.getActiveNavs()[0];
        if(this.navParams.get('toAddFolder')) {
            this.fromAddFolder = this.navParams.get('toAddFolder');
        }
    }

    public toggleTextPasswordLogin(): void {
        this.isActiveToggleTextPasswordLogin = this.isActiveToggleTextPasswordLogin ? false : true;
    }

    public getTypeLogin() {
        return this.isActiveToggleTextPasswordLogin ? 'password' : 'text';
    }

    public toggleTextPasswordRegister(): void {
        this.isActiveToggleTextPasswordRegister = this.isActiveToggleTextPasswordRegister ? false : true;
    }

    public getTypeRegister() {
        return this.isActiveToggleTextPasswordRegister ? 'password' : 'text';
    }

    returnBack() {
        this.navCtrl.pop();
    }

    goToPage(page) {
        switch (page) {
            case 'register':
                this.loginPage = false;
                break;
            case 'login':
                this.loginPage = true;
                break;
            // case 'terms':
            //     this.navCtrl.push(SavedImages);
            //     break;
            // case 'privacy':
            //     this.navCtrl.push(Folders);
            //     break;
        }
    }

    login(form) {
        if (form.valid) {
            this.showErrorsLogin = false;
            let form_data = Object.keys(this.loginCredentials).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(this.loginCredentials[key]);
            }).join('&');

            this.signService.login(form_data).subscribe(data => {
                if (data['token'] && data['token'] != '') {
                    this.errors.loginError = false;
                    this.storageService.set('token', data['token']);

                    // this.signService.userInfo(data['token']).subscribe((data) => {
                    //     console.log(data);
                    //     let user = {
                    //         name: data['user'].name,
                    //         email: data['user'].email
                    //     };
                    //     // this.storageService.set('user', user);
                    // });

                    if(this.fromAddFolder){
                        this.navCtrl.push(AddFolder).then(() => {
                            const index = this.viewCtrl.index;
                            this.nav.remove(index);
                        });
                    } else {
                        this.navCtrl.push(Account).then(() => {
                            const index = this.viewCtrl.index;
                            this.nav.remove(index);
                        });
                    }
                }
            }, (error) => {
                if (error['status'] == 401) {
                    this.errors.loginError = true;
                }
            });

        } else {
            this.showErrorsLogin = true;
        }
    }

    register(form) {
        if (form.valid) {
            this.showErrorsRegister = false;

            let form_data = Object.keys(this.registerCredentials).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(this.registerCredentials[key]);
            }).join('&');

            this.signService.register(form_data).subscribe(data => {
                console.log(data);
                if (data['message'] = 'registration success') {
                    this.errors.registerError = false;
                    let form_data_login = Object.keys(this.registerCredentials).map((key) => {
                        if (key != 'name') {
                            return encodeURIComponent(key) + '=' + encodeURIComponent(this.registerCredentials[key]);
                        }
                    }).join('&');
                    this.signService.login(form_data_login).subscribe((data) => {
                        if (data['token'] && data['token'] != '') {
                            this.storageService.set('token', data['token']);

                            // this.signService.userInfo(data['token']).subscribe((data_login) => {
                            //     let user = {
                            //         name: data_login['user'].name,
                            //         email: data_login['user'].email
                            //     };
                            //     this.storageService.set('user', user);


                            if (this.fromAddFolder) {
                                this.navCtrl.push(AddFolder).then(() => {
                                    const index = this.viewCtrl.index;
                                    this.nav.remove(index);
                                });
                            } else {
                                this.navCtrl.push(Account).then(() => {
                                    const index = this.viewCtrl.index;
                                    this.nav.remove(index);
                                });
                            }
                        }

                    }, (error) => {
                    });
                } else {
                    this.errors.registerError = true;
                }
            }, error => {
                if(error.error.message = 'This Email is already in use.') {
                    this.errors.userError = true;
                    this.errors.registerError = false;
                } else {
                    this.errors.registerError = true;
                    this.errors.userError = false;
                }
            });
        } else {
            this.showErrorsRegister = true;
        }
    }
}
