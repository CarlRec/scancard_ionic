import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
// import Tesseract from 'tesseract.js';
import Croppr from 'croppr';
import { GoogleCloudVisionServiceProvider } from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
// import {ImagePage} from "../image-page/image-page";


@Component({
    selector: 'select-text',
    templateUrl: 'select-text.html'
})

export class SelectText {
    image: any;
    croppr: any;
    canvas: any;
    context: any;

    constructor(public navParams: NavParams, public navCtrl: NavController, private vision: GoogleCloudVisionServiceProvider) {
        this.image = navParams.get("image");
    }

    ionViewDidLoad() {
        let cropprWidth = window.innerWidth*0.8;
        this.croppr = new Croppr('#croppr-text', {
            startSize: [cropprWidth, 60, 'px']
        });
    }


    getText(index) {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');



        let imgSource = new Image();
        imgSource.src = this.image.src;

        let croppedImage = this.cropping(imgSource);


        this.vision.getLabels(croppedImage).subscribe((result) => {
            let resp = result.responses[0];
            // console.log('cropped result is: ' + resp.fullTextAnnotation.text);

            let text = resp.fullTextAnnotation.text.replace('\n', ' ');

            if(resp.fullTextAnnotation.text){
                if (index == 0 || index == null){
                    //Google
                    window.open('http://google.com/search?q=' + text);
                }
                if (index == 1){
                    //Facebook
                    window.open('http://facebook.com/search?q=' + text);
                }
                if (index == 2){
                    //Instagram
                    window.open('https://instagram.com/explore/tags/' + text);
                }
                if (index == 3){
                    //Linkedln
                    window.open('http://linkedln.com/search/results/index/keywords=' + text);
                }
            }

        }, err => {
            // console.log(err.error.error.message);
        });

        // Tesseract.recognize(croppedImage)
        //         .then(function(result){
        //             console.log('cropped result is: ', result);
        //         });
    }

    cropping(input) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let cropped = this.croppr.getValue();
        this.canvas.width = cropped.width;
        this.canvas.height = cropped.height;
        this.context.drawImage(input, cropped.x , cropped.y, cropped.width, cropped.height, 0, 0, this.canvas.width, this.canvas.height);
        return  this.canvas.toDataURL();
    }

}
