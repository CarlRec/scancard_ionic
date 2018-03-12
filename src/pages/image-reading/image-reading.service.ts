import { Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/Observable";
// import {Observable} from "rxjs/Observable";

@Injectable()
export class ImageReadingService {
  constructor(private http: HttpClient) {

  }

  sendImage(img, token): Observable<Object>{
    console.log('inside request');
    return this.http.post('http://scannoo.com/api/v1/photo?token=' + token, img);
  }

  getImages(token) {
      return this.http.get('http://scannoo.com/api/v1/photo?token=' + token);
  }
}
