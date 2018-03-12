import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
// import {Config} from "ionic-angular";
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Injectable()
export class SignInUpService {
    constructor(private http: HttpClient) {

    }

    register(user): Observable<Object> {
        return this.http.post("http://scannoo.com/api/v1/authenticate/register", user, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    }

    login(user): Observable<Object> {
        return this.http.post("http://scannoo.com/api/v1/authenticate", user, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    }

    userInfo(token) {
        return this.http.get('http://scannoo.com/api/v1/authenticate/user?token=' + token);
    }
}
