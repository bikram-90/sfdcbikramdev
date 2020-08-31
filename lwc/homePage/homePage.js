import { LightningElement, track } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import ComfyHouseSetupFiles from '@salesforce/resourceUrl/ComfyHouseSetupFiles';
import FontAwesome from '@salesforce/resourceUrl/FontAwesome';
import GoogleFont from '@salesforce/resourceUrl/GoogleFont';
import {serviceWorkerHelper} from 'c/serviceWorkerHelper';

const productsJSONPath = ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/products.json';

//Variables
let cartBtn;
let closeCartBtn;
let clearCartBtn;
let cartDOM;
let cartOverlay;
let cartItems;
let cartTotal;
let cartContent;
let productsDOM;
//cart
let cart = [];
//buttons
let buttonsDOM = [];


export default class HomePage extends LightningElement {

    /*constructor() {
        try {
            super();
            console.log('INSIDE CONSTRUCTOR');
        } catch (error) {
            console.log(error);
        }
    }*/

    get logoImagePath() {
        return ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/logo.svg';
    }

    get product1ImagePath() {
        return ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/product-1.jpeg';
    }

    get heroImagePath() {
        return ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/hero-bcg.jpeg';
    }

    //Try to set this in CSS 
    get heroStyle() {
        return 'min-height: calc(100vh - 60px);'
            + 'background: url(' + this.heroImagePath + ') center/cover no-repeat;'
            + 'display: flex;'
            + 'align-items: center;'
            + 'justify-content: center;';
    }

    connectedCallback() {
        console.log('INSIDE CONNECTED CALLBACK');
        loadScript(this, FontAwesome + '/fontawesome.js');
        loadStyle(this, GoogleFont + '/googleFont.css');
        
        // if('serviceWorker' in navigator){
        //     navigator.serviceWorker.register(serviceWorkerHelper)
        //     .then(function(){
        //         console.log('SERVICE WORKER REGISTERED');        
        //     });
        // }
    }

    renderedCallback() {
        console.log('INSIDE RENDERED CALLBACK ');

        cartBtn = this.template.querySelector(".cart-btn");
        closeCartBtn = this.template.querySelector(".close-cart");
        clearCartBtn = this.template.querySelector(".clear-cart");
        cartDOM = this.template.querySelector(".cart");
        cartOverlay = this.template.querySelector(".cart-overlay");
        cartItems = this.template.querySelector(".cart-items");
        cartTotal = this.template.querySelector(".cart-total");
        cartContent = this.template.querySelector(".cart-content");
        productsDOM = this.template.querySelector(".products-center");

        try {
            const ui = new UI();
            const prds = new Products();

            //setup App
            ui.setupApp();

            //Get all products
            prds.getProducts().then(products => {
                ui.displayProducts(products);
                //this.productsArray = products;
                Storage.saveProducts(products);
            }).then(() => {
                const buttons = [...this.template.querySelectorAll(".bag-btn")];
                console.log('All buttons :- ' + buttons);
                ui.getBagButtons(buttons);
                ui.cartLogic();
            });

        } catch (error) {
            console.log(error);

        }
    }
}

//getting the Products
export class Products {

    async getProducts() {
        try {
            let result = await fetch(productsJSONPath);
            let data = await result.json();
            let prds = data.items;
            prds = prds.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                //const image = item.fields.image.fields.file.url;
                const image = ComfyHouseSetupFiles + '/setup-files-js-comfy-house-master/images/product-' + item.sys.id + '.jpeg';
                return { title, price, id, image };
            });
            return prds;
        } catch (error) {
            console.log(error);
        }
    }

}

//display Products
export class UI {

    displayProducts(products) {
        try {
            console.log(products);
            let result = '';
            products.forEach(product => {
                result += `
                    <!-- Single Product -->
                    <article class="product">
                        <div class="img-container">
                            <img src=${product.image} alt="product"
                            class="product-img">
                            <button class="bag-btn" data-id=${product.id}>
                                <i class="fas fa-shopping-cart"></i>
                                add to bag
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>$${product.price}</h4>
                    </article>
                <!-- Single Product -->
            `;
            });
            productsDOM.innerHTML = result;
            console.log('PRODUCTS LOADED IN DOM');
        } catch (error) {
            console.log(error);
        }
    }

    getBagButtons(buttons) {
        console.log('INSIDE UI getBagButtons');
        try {
            //const buttons = [...this.template.querySelectorAll(".bag-btn")]; //turns this into an array

            buttonsDOM = buttons;

            buttons.forEach(button => {
                let id = button.dataset.id;
                let inCart = cart.find(item => item.id === id);

                if (inCart) {
                    button.innerText = "In Cart";
                    button.disabled = true;

                }
                button.addEventListener('click', (event) => {

                    console.log(event);
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;

                    //get product from products
                    let cartItem = { ...Storage.getProduct(id), amount: 1 };
                    console.log(cartItem);

                    //add prd to the cart
                    cart = [...cart, cartItem];
                    console.log(cart);

                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem);
                    //show the cart
                    this.showCart();
                })
            });
        } catch (error) {
            console.log(error);
        }

    }

    setCartValues(cart) {
        try {
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map(item => {
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            })
            cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
            cartItems.innerText = itemsTotal;
            console.log(cartTotal, cartItems);
        } catch (error) {
            console.log(error);
        }

    }

    addCartItem(item) {

        try {
            //const div = this.template.createElement('div');
            //div.classList.add('cart-item');
            //div.innerHTML = `
            let result = '';
            result = `
            <div class="cart-item">
                <img src=${item.image} alt="product">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>   
                </div>
        `;
            //cartContent.appendChild(result);
            const doc = new DOMParser().parseFromString(result, "text/html");
            cartContent.appendChild(doc.body.firstChild);
            console.log(cartContent);
        } catch (error) {
            console.log(error);
        }
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }

    setupApp() {
        try {
            console.log('INSIDE UI SETUPAPP');
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart);
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
        } catch (error) {
            console.log(error);
        }
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));

    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic() {
        try {
            //Clear Cart Button
            clearCartBtn.addEventListener("click", () => {
                this.clearCart();
            });
            //Cart Functionality
            cartContent.addEventListener("click", event => {
                console.log(event.target);
                if (event.target.classList.contains('remove-item')) {
                    let removeItem = event.target;
                    let id = removeItem.dataset.id;
                    cartContent.removeChild(removeItem.parentElement.parentElement);
                    this.removeItem(id);
                } else if (event.target.classList.contains('fa-chevron-up')) {
                    let increaseAmount = event.target;
                    let id = increaseAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount++;
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    increaseAmount.nextElementSibling.innerText = tempItem.amount;
                } else if (event.target.classList.contains('fa-chevron-down')) {
                    let decreaseAmount = event.target;
                    let id = decreaseAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount--;
                    if (tempItem.amount > 0) {
                        Storage.saveCart(cart);
                        this.setCartValues(cart);
                        decreaseAmount.previousElementSibling.innerText = tempItem.amount;
                    } else {
                        cartContent.removeChild(decreaseAmount.parentElement.parentElement);
                        this.removeItem(id);
                    }

                }

            });
        } catch (error) {

        }
    }

    clearCart() {
        console.log('INSIDE CLEAR CART');
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }

        this.hideCart();
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`;
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }

}

//local storage
export class Storage {

    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

}