import { Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CropImageService {
    constructor(private http: HttpClient) {

    }

    sendCroppedCoordinates(data){

        return this.http.post('/crop', data);
    }
}
