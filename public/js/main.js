console.log("main.js está carregado"); // No início do arquivo main.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado e analisado");
    var cartContent = document.getElementsByClassName('cart-content')[0];
    if (cartContent) {
        console.log("Elemento .cart-content encontrado");
    } else {
        console.error("Elemento .cart-content não encontrado");
    }
});
// cart open close
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closecart = document.querySelector('#close-cart');

// open cart
cartIcon.onclick = () => {
    cart.classList.add('active');
}

// close cart
closecart.onclick = () => {
    cart.classList.remove('active');
};

// making add to cart
// cart working js
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// fazendo a função
function ready() {
    // remover item
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // escolha de quantidade
    var quantityInputs = document.getElementsByClassName('cart-quantitiy');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    // adicionar ao carrinho
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
}

// adicionar ao click
function addCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.getElementsByClassName('product-title')[0].innerText;
    var price = shopItem.getElementsByClassName('price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('product-img')[0].src;
    addItemToCart(title, price, imageSrc);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addItemToCart(title, price, imageSrc) {
    var cartItems = document.getElementsByClassName('cart-content')[0];
    if (!cartItems) {
        console.error('cart-content element not found');
        return;
    }
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItemNames = cartItems.getElementsByClassName('cart-product-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('Este item já foi adicionado ao carrinho');
            return;
        }
    }
    var cartBoxContents = `
        <img src="${imageSrc}" alt="" class="cart-img">
        <div class="details-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" name="quantity" value="1" class="cart-quantitiy">
        </div>
        <i class='bx bx-trash-alt cart-remove'></i>
        
    `;
    cartShopBox.innerHTML = cartBoxContents;
    cartItems.appendChild(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantitiy')[0].addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon()
}

// remove cart item
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// quantidade selecionada
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// update total
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    if (!cartContent) {
        console.error('cart-content element not found');
        return;
    }
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantitiy')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = 'R$' + total;
    // save total in local storega
    localStorage.setItem('cartTotal', total);
}
// manter item no carrinho quando a pagina for recarregada
function saveCartItems(){
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
    for(var i=0; i<cartBoxes.length; i++){
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantitiy')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;
        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item)
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}
//load no carrinho
function loadCartItems(){
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems){
        cartItems = JSON.parse(cartItems);

        for (var i=0; i<cartItems.length; i++){
            var item = cartItems[i];
            addItemToCart(item.title, item.price,item.productImg);
            var cartBoxes = document.getElementsByClassName('cart-box');
            var carrtBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantitiy')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText="R$"+ cartTotal;

    }
    updateCartIcon()
}
// quantidade de itens no carrinho 
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantitiy')[0];
        quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantitiy', quantity);
    
    // Atualiza o conteúdo do elemento HTML com a quantidade do carrinho
    var quantityDisplay = document.getElementById('cart-quantity-display');
    quantityDisplay.textContent = quantity;

    console.log(quantity);
}
