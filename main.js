let cartIcon=document.querySelector('#cart-icon');
let cart=document.querySelector('.cart');
let closeCart=document.querySelector('#close-cart');

cartIcon.onclick=()=>{
    cart.classList.add("active");
}
closeCart.onclick=()=>{
    cart.classList.remove("active");
}

if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded',ready);
}else{
    ready();
}
function ready(){
    var removeCartItemButtons=document.getElementsByClassName('cart-remove');
    console.log(removeCartItemButtons);
    for(let i=0;i<removeCartItemButtons.length;i++){
        let button=removeCartItemButtons[i];
        button.addEventListener('click',removeCartItem);
    }
    var quantityInputs=document.getElementsByClassName('cart-quantity');
    for(let i=0;i<quantityInputs.length;i++){
        let input=quantityInputs[i];
        input.addEventListener('change',quantityChanged);
    }
    var addToCart=document.getElementsByClassName('add-cart');
    for(let i=0;i<addToCart.length;i++){
        let button=addToCart[i];
        button.addEventListener('click',addToCartClicked);
    }
    document.getElementsByClassName('btn-buy')[0].addEventListener('click',buyClicked);
    
}
function buyClicked(){
    alert('Thank you for your purchase');
    console.log('Starting to clear the cart');
    setTimeout(() => {
        let cartItems=document.getElementsByClassName('cart-content')[0];
        while(cartItems.hasChildNodes()){
            cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal();
    }, 1000); // Delay of 2 seconds
}
function removeCartItem(event){
    let buttonClicked=event.target;
    buttonClicked.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event){
    let input=event.target;
    if(isNaN(input.value)||input.value<=0){
        input.value=1;
    }
    updateCartTotal();
}
console.log('Quantity changed'); // Log the quantity changed
function addToCartClicked(event){
    console.log('addToCartClicked function called'); // Log that the function is called
    let button=event.target;
    let shopItem=button.parentElement;
    let title=shopItem.getElementsByClassName('product-title')[0].innerText;
    let price=shopItem.getElementsByClassName('price')[0].innerText;
    let imageSrc=shopItem.getElementsByClassName('product-img')[0].src;
    console.log('Title:', title); // Log the title
    console.log('Price:', price); // Log the price
    console.log('Image source:', imageSrc); // Log the image source
    addItemToCart(title,price,imageSrc);
    updateCartTotal();
}
addItemToCart = (title, price, imageSrc) => {
    console.log('Adding item to cart:', title, price, imageSrc); // Log the item details

    let cartItems = document.getElementsByClassName('cart-content')[0];
    let cartItemNames = cartItems.getElementsByClassName('cart-product-title');
    console.log('Cart item names:', cartItemNames);
    console.log('Title:', title);
    for(let i = 0; i < cartItemNames.length; i++){
        console.log('Cart item name:', cartItemNames[i].innerText);
        if(cartItemNames[i].innerText.trim().toLowerCase() == title.trim().toLowerCase()){
            console.log('This item is already added to the cart');
            alert('This item is already added to the cart');
            return;
        }
    }

    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-box');

    let img = document.createElement('img');
    img.src = imageSrc;
    img.alt = title;
    img.className = 'cart-img';

    let detailBox = document.createElement('div');
    detailBox.className = 'detail-box';

    let titleDiv = document.createElement('div');
    titleDiv.className = 'cart-product-title';
    titleDiv.innerText = title;

    let priceDiv = document.createElement('div');
    priceDiv.className = 'cart-price';
    priceDiv.innerText = price;

    let input = document.createElement('input');
    input.type = 'number';
    input.value = '1';
    input.className = 'cart-quantity';

    let i = document.createElement('i');
    i.className = 'bx bxs-trash cart-remove';

    detailBox.append(titleDiv, priceDiv, input);
    cartRow.append(img, detailBox, i);

    cartItems.append(cartRow);

    i.addEventListener('click', removeCartItem);
    input.addEventListener('change', quantityChanged);
}
function updateCartTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;

    for(let i = 0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];

        if(priceElement && quantityElement) {
            var quantity = quantityElement.value;
            var price = parseFloat(priceElement.innerText.replace('$',''));
            total += quantity * price;
        } else {
            console.error('Price or quantity element not found in cart box:', cartBox);
        }
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = '$' + total;
}