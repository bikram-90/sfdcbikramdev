import { LightningElement, track, api } from "lwc";

export default class ProgressIndicatorPathType extends LightningElement {
  
  @api objApiNameDesignProperty;
  @api fieldsetNameDesignProperty;
  @api fieldsNameDesignProperty = [];

  @track currentStep = "1";
  @track step1 = true;
  @track step2 = false;
  @track step3 = false;
  @track step4 = false;
  @track step5 = false;

  renderedCallback() {
    console.log("Inside renderedCallback");
    console.log("objApiNameDesignProperty : " + this.objApiNameDesignProperty);
    console.log("fieldsetNameDesignProperty : " + this.fieldsetNameDesignProperty);
    console.log("fieldsNameDesignProperty : " + this.fieldsNameDesignProperty);
  }

  handlePathClick(event) {
    try {
      console.log(
        "event dataset :- " + JSON.stringify(event.currentTarget.dataset)
      );
      console.log(
        "event data-key defined at element level :- " +
          JSON.stringify(event.currentTarget.dataset.key)
      );
      let pathNumStr = event.currentTarget.dataset.key;
      let pathNum = parseInt(pathNumStr, 10);
      this.currentStep = pathNumStr;
      this.changeStepName(pathNum);
    } catch (error) {
      console.log("Error from handlePathClick : " + error);
    }
  }

  changeStepName(stepNum) {
    switch (stepNum) {
      case 1:
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
        break;
      case 2:
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
        break;
      case 3:
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
        this.step4 = false;
        this.step5 = false;
        break;
      case 4:
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.step5 = false;
        break;
      case 5:
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = true;
        break;
      default:
        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.step4 = false;
        this.step5 = false;
        break;
    }
  }
}