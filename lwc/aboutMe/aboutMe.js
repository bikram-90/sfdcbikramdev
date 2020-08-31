import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import PortfolioFiles from '@salesforce/resourceUrl/PortfolioFiles';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import Normalize from '@salesforce/resourceUrl/NormalizeCSS';

export default class AboutMe extends LightningElement {


    get logoImagePath() {
        return PortfolioFiles + '/portfoliofiles/img/devbikram.png';
    }
    get myPicturePath() {
        return PortfolioFiles + '/portfoliofiles/img/bikram-01.jpg';
    }
    get aboutMeImgPath() {
        return PortfolioFiles + '/portfoliofiles/img/bikram-02.jpg';
    }

    connectedCallback() {
        console.log('INSIDE CONNECTED CALLBACK');
        loadScript(this, FontAwesome + '/fontawesome.js');
        //loadStyle(this, Normalize + '/normalize.css');
    }

}