import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-popupmessage',
    templateUrl: './pop-up-message.component.html',
    styleUrls: ['./pop-up-message.component.css']
})
export class PopUpMessageComponent {
    /** constructor **/
    constructor(public dialogRef: MatDialogRef<PopUpMessageComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    /** function close modal pop up window message**/
    close() {
        this.dialogRef.close();
    }
}
