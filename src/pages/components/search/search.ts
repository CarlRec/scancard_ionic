import {Component, EventEmitter, Output} from "@angular/core";
import {Platform} from "ionic-angular";

@Component({
    selector: 'search-component',
    templateUrl: 'search.html'
})

export class SearchComponent {
    @Output() notifyImages: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyFolders: EventEmitter<string> = new EventEmitter<string>();
    search: string = '';
    asd: any;
    count: number = 0;


    constructor(private platform: Platform) {
        this.platform.ready().then(() => {
            let that = this;

            that.notifyImages.emit(that.search);
            that.notifyFolders.emit(that.search);
            // let searchInput = document.getElementsByClassName('text-input');
            // let savedImgView = document.querySelector('saved-images');
            // let foldersView = document.querySelector('folders');

            // for (let i = 0; i < searchInput.length; i++) {
                document.addEventListener('input', function (event) {
                    that.asd = event.target === document.querySelector('saved-images .text-input');
                    console.log(event.target);

                    console.log(event.target === document.querySelector('saved-images .text-input'));
                    if (event.target === document.querySelector('saved-images .text-input')) {
                        that.count++;
                        that.notifyImages.emit(that.search);
                    }

                    if (event.target === document.querySelector('folders .text-input')) {
                        that.count++;
                        that.notifyFolders.emit(that.search);
                    }
                });
            // }
        });
    }

    inputBlur(e) {
        let eTarget = <HTMLInputElement>e.target;
        if (!!document.querySelector('saved-images') && document.querySelector('saved-images').contains(eTarget)
            && eTarget === document.querySelector('saved-images .text-input')) {
            if (this.search.length > 0) {
                document.querySelector('saved-images .text-input').classList.add('not-empty');
            } else {
                document.querySelector('saved-images .text-input').classList.remove('not-empty');
            }
            this.notifyImages.emit(this.search);
        }

        if (!!document.querySelector('folders') && document.querySelector('folders').contains(eTarget)
            && eTarget === document.querySelector('folders .text-input')) {
            if (this.search.length > 0) {
                document.querySelector('folders .text-input').classList.add('not-empty');
            } else {
                document.querySelector('folders .text-input').classList.remove('not-empty');
            }
            this.notifyFolders.emit(this.search);
        }
    }
}
