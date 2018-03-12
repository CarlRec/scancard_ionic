import { Component } from '@angular/core';

// import { CameraPage } from '../pages/camera-page/camera-page';

//to remove
import {SavedImages} from "../pages/saved-images/saved-images";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // rootPage = CameraPage;
  rootPage = SavedImages;

  constructor() {

  }
}
