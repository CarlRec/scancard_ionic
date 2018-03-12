import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler, Config} from 'ionic-angular';
import {HttpClientModule} from "@angular/common/http";
import {MyApp} from './app.component';
// import { ImageCropperModule } from "ng2-img-cropper/index";
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import { environment } from '../environment';
import {IonicStorageModule} from '@ionic/storage';


import {CameraPage} from '../pages/camera-page/camera-page';
import {ImageReading} from '../pages/image-reading/image-reading';
import {ImagePage} from "../pages/image-page/image-page";
import {SavedImages} from "../pages/saved-images/saved-images";
import {CustomFooter} from "../pages/components/custom-footer/custom-footer";

// import {StatusBar} from '@ionic-native/status-bar';
// import {SplashScreen} from '@ionic-native/splash-screen';
import {Folders} from "../pages/folders/folders";
import {AddFolder} from "../pages/add-folder/add-folder";
import {More} from "../pages/more/more";
import {Account} from "../pages/account/account";
import {HowItWorks} from "../pages/how-it-works/how-it-works";
import {SignInUp} from "../pages/sign-in-up/sign-in-up";
import {EditImage} from "../pages/edit-image/edit-image";
import {CropImage} from "../pages/crop-image/crop-image";
import {SelectText} from "../pages/select-text/select-text";
import {SearchComponent} from "../pages/components/search/search";
import {FilterPipe} from "../pages/components/filter-pipe";
import {FadeTransition} from "../pages/components/fade-transition";
import {BarcodeQR} from "../pages/barcode-qr/barcode-qr";
import {GoogleCloudVisionServiceProvider} from '../providers/google-cloud-vision-service/google-cloud-vision-service';
import {SocialSharing} from "@ionic-native/social-sharing";
import { NgxZxingModule } from 'ngx-zxing';

@NgModule({
    declarations: [
        MyApp,
        CameraPage,
        ImageReading,
        ImagePage,
        EditImage,
        CropImage,
        SelectText,
        SavedImages,
        Folders,
        AddFolder,
        More,
        Account,
        SignInUp,
        HowItWorks,
        CustomFooter,
        SearchComponent,
        FilterPipe,
        BarcodeQR
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        HttpClientModule,
        NgxZxingModule
        // AngularFireModule.initializeApp(environment.firebaseConfig),
        // AngularFireDatabaseModule,
        // AngularFireAuthModule,

    ],
    exports: [
        FilterPipe
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        CameraPage,
        ImageReading,
        ImagePage,
        EditImage,
        CropImage,
        SelectText,
        Folders,
        AddFolder,
        More,
        Account,
        SignInUp,
        HowItWorks,
        SavedImages,
        SearchComponent,
        BarcodeQR
    ],
    providers: [
        // StatusBar,
        // SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        GoogleCloudVisionServiceProvider,
        SocialSharing
    ]
})
export class AppModule {
    constructor(public config: Config) {
        this.config.setTransition('fade-transition', FadeTransition);

    }
}
