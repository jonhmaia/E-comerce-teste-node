document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const product = {
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
    };

    // Adicionando ao localStorage para simplicidade
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    alert('Produto adicionado com sucesso!');
    this.reset();
});
