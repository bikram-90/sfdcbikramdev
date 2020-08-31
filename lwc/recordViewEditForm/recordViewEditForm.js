import { LightningElement, track, api, wire } from "lwc";
import getSObjectRecord from "@salesforce/apex/RecordViewEditFormController.getSObjectRecord";
import getFieldAPINames from "@salesforce/apex/RecordViewEditFormController.getFieldAPINames";

let objAPIDesignProperty;
let fieldsetDesignProperty;
let runOnce;
let OtherCity;
let OtherCountry;
let fieldsToHideSet = new Set();

export default class RecordViewEditForm extends LightningElement {
  @api objApiNameDesignProperty;
  @api fieldsetNameDesignProperty;
  @api fieldsNameDesignProperty = [];
  @track objectApiName;
  @track recordId;
  @track fieldAPINameList;

  connectedCallback() {
    console.log("Inside connectedCallback");
  }
  renderedCallback() {
    console.log("Inside renderedCallback");
    console.log("objApiNameDesignProperty : " + this.objApiNameDesignProperty);
    console.log("fieldsetNameDesignProperty : " + this.fieldsetNameDesignProperty);
    console.log("fieldsNameDesignProperty : " + this.fieldsNameDesignProperty);

    if (!runOnce) { //When lightning input field is redendered for each field form re-renders firing renderedCallback() and onLoad()
      runOnce = "DO NOT RUN AGAIN";
      getFieldAPINames({ objectAPIName: this.objApiNameDesignProperty, fieldSetName: this.fieldsetNameDesignProperty })
        .then((result) => {
          console.log("Original Result : " + result);
          //Parse the result START
          result = result.replace(/[\[\]']+/g, ""); //Remove '[' and ']'
          //console.log("Result without [  ] : " + result);
          let resultString = [];
          resultString = result.split(","); //Split the string using ',' to an array
          //console.log("resultString array : " + resultString);
          for (var i = 0; i < resultString.length; i++) {
            resultString[i] = resultString[i].replace(/"/g, ""); //Remove double quotes
          }
          this.fieldAPINameList = resultString;//Dynamically add lightning input field, by populating fieldAPINameList
          console.log("field set APINames : " + this.fieldAPINameList);
          //Parse the result END
        })
        .catch((error) => {
          console.log("Error from getFieldAPINames : " + error);
        });
    }
  }

  disconnectedCallback() {
    runOnce = undefined;
    console.log("Inside disconnectedCallback");
  }
  handleLoad(event) {
    console.log("Inside handleLoad");
    //console.log('From handleLoad event detail ' + JSON.stringify(event.detail));

    //Hide specific fields, provide the example: OtherCity , OtherCountry
    //we can use custom label, custom metadata or design property
    /*fieldsToHideSet.add("OtherCity");
    fieldsToHideSet.add("OtherCountry");
    console.log("Inside handleLoad : " + fieldsToHideSet.entries());
    this.hideSpecificFields(fieldsToHideSet);*/

    //Using Design property of LWC
    fieldsToHideSet.clear(); //When cmp rerenders it will not retain old values
    if(this.fieldsNameDesignProperty.length){
      let resultString = [];
      resultString = this.fieldsNameDesignProperty.split(",");
      for(let i = 0; i < resultString.length; i++){        
        console.log("Inside handleLoad resultString : " + resultString[i]);
        fieldsToHideSet.add(resultString[i]);        
      }
      if(fieldsToHideSet.size){
        console.log("Inside handleLoad size : " + fieldsToHideSet.size);
        for (let value of fieldsToHideSet) console.log("Inside handleLoad value : " + value);
        this.hideSpecificFields(fieldsToHideSet);
      }      
    }
  }
  handleSubmit(event) {
    console.log("Inside handleSubmit");
  }
  handleSuccess(event) {
    console.log("Inside handleSuccess");
  }
  handleError(event) {
    console.log("Inside handleError : " + JSON.stringify(event.detail));
  }
  handleFieldChange(event) {
    console.log("Inside handleFieldChange : " + event.target.fieldName);
    if (event.target.fieldName === "Address_Type__c") {
      console.log("handleFieldChange Address_Type__c : " + event.detail.value);
      this.handleAddressChange(event.detail.value);
    }
    if (event.target.fieldName === "AccountId") {
      console.log("handleFieldChange AccountId : " + event.detail.value);
    }
  }
  handleAddressChange(value) {
    console.log("handleAddressChange value : " + value);
    if (value === "Other") {
      this.showSpecificFields(fieldsToHideSet);
    } else if (value === "Mailing") {
      this.hideSpecificFields(fieldsToHideSet);
    }
  }

  hideSpecificFields(fieldsToHideSet) {
    console.log("FROM hideSpecificFields fieldsToHideSet : " + fieldsToHideSet.entries());
    for (let item of fieldsToHideSet) {
      if (this.template.querySelector(`[data-id="${item}"]`)) {
        this.template.querySelector(`[data-id="${item}"]`).classList.add("slds-hide");
      }
    }
  }

  showSpecificFields(fieldsToHideSet) {
    console.log("FROM showSpecificFields fieldsToHideSet : " + fieldsToHideSet.entries());
    for (let item of fieldsToHideSet) {
      if (this.template.querySelector(`[data-id="${item}"]`)) {
        this.template.querySelector(`[data-id="${item}"]`).classList.remove("slds-hide");
      }
    }
  }
}