const $productsImgWrapper = document.querySelector('.item__img')
const $productsContentWrapper = document.querySelector('.item__content__titlePrice')

const $url = window.location.href

/**
 * Create the image of an item in html
 * @param {object} product Product from the API
 * @returns $productImg
 */
const createProductImg = product => {
    const $productImg = document.createElement('img')

    $productImg.setAttribute('src', `${product.imageUrl}`)
    $productImg.setAttribute('alt', `${product.altTxt}`)

    return $productImg
}
/**
 * Create the values in the fields
 * @param {object} product Product from the API
 */
const addContent = product => {
    const $productTitle = document.querySelector('#title')
    $productTitle.textContent = product.name

    const $productPrice = document.querySelector('#price')
    $productPrice.textContent = product.price

    const $productDescription = document.querySelector('#description')
    $productDescription.textContent = product.description

    const $productColor = document.querySelector('#colors')
    
    for (let color of product.colors ) {
        const $productOption = document.createElement('option')
        $productOption.setAttribute('value', color)
        $productOption.textContent = color
        $productColor.appendChild($productOption)
    }
}


/**
 * Add on click event listener to the add to cart button and add the product to localStorage 
 */
const $addToCartButton = document.getElementById('addToCart').addEventListener("click", product => {
    var storage = localStorage.getItem('product'); 
    
    var id = getIdProduct()
    var colorObject = document.getElementById("colors");
    var color = colorObject.value;
    var qte = parseInt(document.getElementById("quantity").value);
    var serializeProduct = []

    if (storage){
        var productExist = false;
        serializeProduct = JSON.parse(storage);

        for (product of serializeProduct) {
            if(id == product.id && color == product.color) {
                product.qte += qte;
                productExist = true;
            }
        }
        if (!productExist){
            serializeProduct.push({
                'id' : id,
                'color' : color,
                'qte' : qte
            })
        }
    } else {
        serializeProduct = [{
            'id' : id,
            'color' : color,
            'qte' : qte
        }]
    }
    let objProduct = JSON.stringify(serializeProduct);
    localStorage.setItem("product", objProduct);
});

/**
 * Get the product's id
 * @returns id
 */
const getIdProduct = () => {
    var url = new URL($url);
    var id = url.searchParams.get("id");

    return id
}

const main = async () => {
    var id = getIdProduct()

    fetch(`http://127.0.0.1:3000/api/products/${id}`)
    .then(res => res.json())
    .then(product => {
        $productsImgWrapper.appendChild(createProductImg(product))
            addContent(product)
    })
    .catch(err => {
        window.alert('Le produit n\'existe pas');
        window.location.href='http://127.0.0.1:5500/front/html/';
    })
}

main()
