const $itemWrapper = document.getElementById('cart__items')

let storage = localStorage.getItem("product");
storedProducts = JSON.parse(storage);

if (!storedProducts){
    createAlert()
}

for(storedinProduct of storedProducts){
    let storedProduct = storedinProduct

    fetch(`http://127.0.0.1:3000/api/products/${storedProduct.id}`)
    .then(res => res.json())
    .then(product => {
        $itemWrapper.appendChild(createItem(storedProduct, product))
        calculTotal(product.price, storedProduct.qte)
    })
    .catch(err => console.log("Oh no", err))     
}
/**
 * Calcul total price and quantity
 * @param {number} price Get price of the product from API
 * @param {number} qte Get quantity from localStorage
 */
function calculTotal(price, qte){
    var totalPrice = document.getElementById('totalPrice')
    var qteProducts = document.getElementById('totalQuantity')

    qteProducts.innerHTML = parseInt(qteProducts.innerHTML) + qte
    totalPrice.innerHTML = parseInt(totalPrice.innerHTML) + price * qte
    total = qte * price;
}
/**
 * Get Id, color and new quantity to update product's quantity
 * @param {string} id Id of the product from API
 * @param {string} color Color of a product from API
 * @param {number} newQte New quantity from the input field
 */
function updateProduct(id, color, newQte) {
    let storedProducts = JSON.parse(localStorage.getItem("product"))
    const $modifiedProduct = storedProducts.find(product => product.id === id && product.color === color)
    $modifiedProduct.qte = newQte
    localStorage.setItem("product",JSON.stringify(storedProducts))
    location.reload()
}

/**
 * Get id and color to select and delete product from cart
 * @param {string} id Id of the product from API
 * @param {string} color Color of a product from API
 */
function deleteProduct( id, color) {
    let storage = localStorage.getItem("product");
    storedProducts = JSON.parse(storage);
    const $index = storedProducts.findIndex((product) => product.id === id && product.color === color);
    storedProducts.splice($index,1)
    localStorage.setItem("product",JSON.stringify(storedProducts))
    location.reload()
}

/**
 * Create the image of an item in cart in html
 * @param {object} product Product from the API
 * @returns $imgContainer
 */
const createItemImg = product => {
    const $imgContainer = document.createElement('div')
    $imgContainer.classList.add('cart__item__img')

    const $img = document.createElement('img')
    $img.setAttribute('src', `${product.imageUrl}`)
    $img.setAttribute('alt', `${product.altTxt}`)

    $imgContainer.appendChild($img)

    return $imgContainer
} 
/**
 * Create a paragraph to inform the user of an empty cart and add button to redirect to the home page
 */
function createAlert(){
    const $alertMessage = document.createElement('p')
    $alertMessage.style.textAlign = 'center'
    $alertMessage.textContent = 'Vous n\'avez pas de produits dans votre panier !'
    const $cta = document.createElement('a')
    $cta.setAttribute('href', 'index.html')
    $cta.textContent = 'Choisir mon canapé'
    $cta.style.backgroundColor = '#2d2f3e'
    $cta.style.display = 'block'
    $cta.style.width = '250px'
    $cta.style.margin = 'auto'
    $cta.style.textAlign = 'center'
    $cta.style.marginBottom = '2em'
    $cta.style.padding = '18px 25px'
    $cta.style.borderRadius = '40px'
    $cta.style.color = '#fff'
    $cta.style.textDecoration = 'none'

    $itemWrapper.append($alertMessage)
    $itemWrapper.append($cta)
}
/**
 * Create the description of an item in cart in html
 * @param {Array} storedProduct Product from localStorage
 * @param {object} product Product from the API
 * @returns $contentDescription
 */
function createItemDescription(storedProduct, product) {
    const $contentDescription = document.createElement('div')
    $contentDescription.classList.add('cart__item__content__description')

    const $productTitle = document.createElement('h2')
    $productTitle.textContent = product.name

    const $productColor = document.createElement('p')
    $productColor.textContent = storedProduct.color

    const $productPrice = document.createElement('p')
    $productPrice.textContent = product.price + ' €'

    $contentDescription.appendChild($productTitle)
    $contentDescription.appendChild($productColor)
    $contentDescription.appendChild($productPrice)

    return $contentDescription
} 
/**
 * Create the settings of an item in cart in html
 * @param {Array} storedProduct Product from localStorage
 * @returns $contentSettings
 */
function createItemSettings(storedProduct) {

    const $contentSettings = document.createElement('div');
    $contentSettings.classList.add('cart__item__content__settings');

    const $contentSettingsQte = document.createElement('div');
    $contentSettingsQte.classList.add('cart__item__content__settings__quantity');

    const $productQte = document.createElement('p');
    $productQte.textContent = 'Qte : ';
    const $productValue = document.createElement('input');
    $productValue.classList.add('itemQuantity');
    $productValue.setAttribute('type', 'number');
    $productValue.setAttribute('name', 'itemQuantity');
    $productValue.setAttribute('min', '1');
    $productValue.setAttribute('max', '100');
    $productValue.setAttribute('value', `${storedProduct.qte}`);

    $productValue.addEventListener("change" , (event) => {
        const $parent = event.target.closest("article") 
        let newQte = event.target.valueAsNumber
        updateProduct($parent.dataset.id, $parent.dataset.color, newQte)
        
    })

    $contentSettingsQte.appendChild($productQte);
    $contentSettingsQte.appendChild($productValue);

    const $productDelete = document.createElement('div');
    $productDelete.classList.add('cart__item__content__settings__delete');

    const $labelDelete = document.createElement('p');
    $labelDelete.classList.add('deleteItem');
    $labelDelete.textContent = 'Supprimer';

    $labelDelete.addEventListener("click" , (event) => {
        const $parent = event.target.closest("article") 
        deleteProduct($parent.dataset.id,$parent.dataset.color)
    })

    $productDelete.appendChild($labelDelete);

    $contentSettings.appendChild($contentSettingsQte);
    $contentSettings.appendChild($productDelete);

    return $contentSettings;
} 
/**
 * Create the content of an item in cart in html
 * @param {Array} storedProduct Product from localStorage
 * @param {object} product Product from the API
 * @returns $contentContainer
 */
function createItemContent(storedProduct, product) {
    const $contentContainer = document.createElement('div')
    $contentContainer.classList.add('cart__item__content')

    const $itemDescription = createItemDescription(storedProduct, product)
    const $itemSettings = createItemSettings(storedProduct)

    $contentContainer.appendChild($itemDescription)
    $contentContainer.appendChild($itemSettings)

    return $contentContainer
} 
/**
 * Create an item in cart in html
 * @param {Array} storedProduct Product from localStorage
 * @param {object} product Product from the API
 * @returns $item
 */
function createItem(storedProduct, product) {
    const $item = document.createElement('article')
    $item.classList.add('cart__item')
    $item.setAttribute('data-id', `${storedProduct.id}`)
    $item.setAttribute('data-color', `${storedProduct.color}`)

    const $img = createItemImg(product)
    const $content = createItemContent(storedProduct, product)

    $item.appendChild($img)
    $item.appendChild($content)

    return $item;
} 

function createOrder(firstName, lastName, address, city, email){  
    let cart=[]
    
    for (product of storedProducts){
        cart.push(product.id)
    }
    console.log('cart: ', cart);
    const order = {
        contact : {
            firstName : firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        },
        products: cart,
    }
    console.log('order: ', order);
    var options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(order)
    }

    fetch('http://localhost:3000/api/products/order', options)
    .then((response) => response.json())
    .then((data) => {
      let confirmationLink="./confirmation.html?id=" + data.orderId
      localStorage.removeItem('product')
      document.location.href = confirmationLink
    })
    .catch(err => console.log("Something went wrong with the API :", err))
}
/**
 * Add listener on confirmation's button click and call function to verify the inputs' values
 */
 
document.getElementById('order').addEventListener("click", (event) => {

    event.preventDefault()
    const $firstName = document.getElementById('firstName')
    const $lastName = document.getElementById('lastName')
    const $address = document.getElementById('address')
    const $city = document.getElementById('city')
    const $email = document.getElementById('email')

    const  $firstNameErrorMsg = document.getElementById('firstNameErrorMsg')
    const  $lastNameErrorMsg = document.getElementById('lastNameErrorMsg')
    const  $addressErrorMsg = document.getElementById('addressErrorMsg')
    const  $cityErrorMsg = document.getElementById('cityErrorMsg')
    const  $emailErrorMsg = document.getElementById('emailErrorMsg')

    let errorFirstName = "Vous devez remplir votre prénom"
    let errorLastName = "Vous devez remplir votre nom"
    let errorAdress = "Vous devez remplir votre adresse"
    let errorCity = "Vous devez remplir votre ville"
    let errorEmail = "Vous devez remplir votre email"

    var checkFirstName = throwError($firstName, errorFirstName, $firstNameErrorMsg, "text")
    console.log('checkFirstName: ', checkFirstName);
    var checkLastName = throwError($lastName, errorLastName, $lastNameErrorMsg, "text")
    console.log('checkLastName: ', checkLastName);
    var checkAddress = throwError($address, errorAdress, $addressErrorMsg, "alpha")
    console.log('checkAddress: ', checkAddress);
    var checkCity = throwError($city, errorCity, $cityErrorMsg, "text")
    console.log('checkCity: ', checkCity);
    var checkEmail = throwError($email, errorEmail, $emailErrorMsg, "email")
    console.log('checkEmail: ', checkCity);

    if (checkFirstName && checkLastName && checkAddress && checkCity && checkEmail){
        createOrder($firstName, $lastName, $address, $city, $email) 
    }
})



/**
 * Throw error depending the tested field  
 * @param {object} objet Get the object in html
 * @param {string} errorMsg Get the message to display
 * @param {object} displayMsg insert the message in a paragraph 
 * @param {string} type case value to test according to the type of field
 */
function throwError(objet,errorMsg ,displayMsg, type){
    var result = true
    switch (type) {
        case "text":
            var textFormat = /^[a-zà-ÿ]+$/
            displayMsg.innerHTML = "";
            try {
                if(objet.value == ""){
                    result = false
                    throw errorMsg;
                } 
                if(!objet.value.match(textFormat)){
                    result = false
                    errorMsg = "Veuillez saisir une chaine de caractère en minuscule"
                    throw errorMsg
                }       
            }
            catch(err) {
                displayMsg.innerHTML = errorMsg;
            }
        break;
        case "alpha": 
            var alphaFormat = /^[a-zA-Z0-9\s,.'\-à-ÿ]{3,}$/
            displayMsg.innerHTML = "";
            try {
                if(objet.value == ""){
                    result = false
                    throw errorMsg;
                } 
                if(!objet.value.match(alphaFormat)){
                    result = false
                    errorMsg = "Veuillez saisir une chaine alphanumérique"
                    throw errorMsg
                }
            }
            catch(err) {
                displayMsg.innerHTML = errorMsg;
            }
        break;
        case "email":
            var mailFormat = /^[a-zA-Z0-9.\-]+[@]{1}[a-zA-Z0-9\-]+.[a-zA-Z0-9\-.]+$/
            displayMsg.innerHTML = "";
            try {
                if(objet.value == "") {
                    result = false
                    throw errorMsg
                }
                if(!objet.value.match(mailFormat)){
                    result = false
                    errorMsg = "Veuillez saisir une adresse mail valide"
                    throw errorMsg
                }
            }
            catch(err){
                displayMsg.innerHTML = errorMsg;
            }
        break;
    }
    return result
}


