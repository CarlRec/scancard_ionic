import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";


@Injectable()
export class ImageService {
    constructor(private http: HttpClient) {

    }

    contactAPI(img): Observable<Object> {


        return this.http.post('http://scannoo.com/api/v1/businessCard', { image: img });

        // return this.http.post('https://api.circleback.com/service/cards/scan', formData,
        //     {
        //         headers: {
        //             'Accept': 'application/json',
        //             'X-CB-ApiKey': 'YmM3OTFhODYtNzI4Mi00NmE2LTljN2YtODMxNGMxMzk1NmQ0',
        //             'Content-Type': 'multipart/form-data;boundary=abcABC123'
        //             // 'Access-Control-Allow-Origin': '*'
        //         }
        //     })

        // return this.http.post('https://language.googleapis.com/v1beta2/documents:analyzeEntitySentiment?key=AIzaSyDUrcpbYJ-xmo8UZiVIBXGTtj_nfHGLhgE',
        //     {
        //         document: document,
        //         required_entities: {'ORGANIZATION': '', 'PERSON': '', 'LOCATION': ''},
        //         encodingType: 'UTF8'
        //     },
        //     { headers: {
        //         'Content-Type': 'application/json'
        //     }});
    }

    updateImage(fav, user_id, token): Observable<Object> {
        return this.http.post('http://scannoo.com/api/v1/updatePhoto?token=' + token, { user_id: user_id, favorite: fav});
    }
}
