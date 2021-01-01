import { LightningElement, track, api, wire } from 'lwc';

export default class RecordViewFormLwc extends LightningElement {

    //@api recordId;
    recordId = '0012x000007WO9hAAG';
    handleOnLoad(event){
        //console.log('Event : ' + JSON.stringify(event));
        //console.log('Event detail : ' + JSON.stringify(event.detail));
        console.log('Phone Field Value : ' + JSON.stringify(event.detail.records[this.recordId].fields.Phone.value));
        console.log('Fax Field Value : ' + JSON.stringify(event.detail.records[this.recordId].fields.Fax.value));
        console.log('Email__c Field Value : ' + JSON.stringify(event.detail.records[this.recordId].fields.Email__c.value));
    }
}