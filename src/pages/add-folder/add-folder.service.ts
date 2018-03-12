import { Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";


@Injectable()
export class AddFolderService {
    constructor(private http: HttpClient) {

    }

    saveFolder(folder, token): Observable<Object> {
        return this.http.post("http://scannoo.com/api/v1/folder?token=" + token, folder, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    }

    getFolders(token) {
        return this.http.get("http://scannoo.com/api/v1/folder?token=" + token,  {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    }
}
