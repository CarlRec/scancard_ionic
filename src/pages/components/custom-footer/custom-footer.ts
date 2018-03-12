import { Component, Input } from "@angular/core";
import { CameraPage } from "../../camera-page/camera-page";
import { NavController } from "ionic-angular";
import { SavedImages } from "../../saved-images/saved-images";
import { Folders } from "../../folders/folders";
import { More } from "../../more/more";


@Component({
  selector: 'custom-footer',
  templateUrl: 'custom-footer.html'
})

export class CustomFooter {
  @Input() public param: number;

  constructor(public navCtrl: NavController){

  }

  changeView(event, view, src, originalSrc) {
    switch(view){
      case 'camera':
        event.target.src = src;
        setTimeout(() => {
            event.target.src = originalSrc;
            this.navCtrl.push(CameraPage);
        }, 100);
        break;
      case 'images':
        event.target.src = src;
          setTimeout(() => {
              event.target.src = originalSrc;
              this.navCtrl.push(SavedImages);
          }, 100);
        break;
      case 'folders':
        event.target.src = src;
          setTimeout(() => {
              event.target.src = originalSrc;
              this.navCtrl.push(Folders);
          }, 100);
        break;
      case 'more':
        event.target.src = src;
          setTimeout(() => {
              event.target.src = originalSrc;
              this.navCtrl.push(More);
          }, 100);
        break;
    }
  }

}
