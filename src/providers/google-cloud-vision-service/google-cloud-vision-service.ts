import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the GoogleCloudVisionServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
interface GoogleVisionResponse {
    responses?: Array<any>;
}

@Injectable()
export class GoogleCloudVisionServiceProvider {
    visionKey: any = "AIzaSyDUrcpbYJ-xmo8UZiVIBXGTtj_nfHGLhgE";

    constructor(public http: HttpClient) {
    }

    getLabels(base64Image) {
        console.log(typeof base64Image);
        let image = base64Image;
        let noHeader = image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        if(typeof noHeader !== 'string') {
            noHeader = noHeader.toString();
        }

        let body = {
            "requests": [
                {
                    "image": {
                        "content": noHeader
                    },
                    "features": [
                        // {
                        //     "type": "TYPE_UNSPECIFIED"
                        // },
                        // {
                        //     "type": "FACE_DETECTION"
                        // },
                        // {
                        //     "type": "LANDMARK_DETECTION"
                        // },
                        // {
                        //     "type": "LOGO_DETECTION"
                        // }
                        //     "type": "IMAGE_PROPERTIES"
                        // },
                        // {,
                        // {
                        //     "type": "LABEL_DETECTION"
                        // },
                        {
                            "type": "TEXT_DETECTION"
                        },
                        {
                            "type": "DOCUMENT_TEXT_DETECTION"
                        },
                        // {
                        //     "type": "SAFE_SEARCH_DETECTION"
                        // },
                        // {
                        //     "type": "CROP_HINTS"
                        // },
                        // {
                        //     "type": "WEB_DETECTION"
                        // }


                    ]
                }
            ]
        };

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return this.http.post<GoogleVisionResponse>('https://vision.googleapis.com/v1/images:annotate?key=' + this.visionKey, JSON.stringify(body), {headers: headers});
    }
}
