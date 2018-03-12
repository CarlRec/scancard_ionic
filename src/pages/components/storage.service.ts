import { Injectable} from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import {Observable} from "rxjs/Observable";
import {Storage} from '@ionic/storage';

@Injectable()
export class StorageService {
    constructor(private storage: Storage) {

    }

    public set(settingName,value){
        return this.storage.set(`setting:${ settingName }`, value);
    }

    public async get(settingName){
        return await this.storage.get(`setting:${ settingName }`);
    }

    public async remove(settingName){
        return await this.storage.remove(`setting:${ settingName }`);
    }

    public clear() {
        this.storage.clear().then(() => {
            console.log('all keys cleared');
        });
    }
}
