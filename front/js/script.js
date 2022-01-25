const $productsWrapper = document.querySelector('.items')

/**
 * Get the data from product's API
 * @param {array} products get the products from API
 * @returns array of products
 */
const _retrieveProductApiData = products => fetch(`http://127.0.0.1:3000/api/products`)
    .then(res => res.json())
    .catch(err => console.log("Oh no", err))

/**
 * Get async products' data
 * @param {array} products Get the products' data
 * @returns promesse
 */
const retrieveProductData = async (products) => {
    return await _retrieveProductApiData(products)
}
/**
 * Create the image of an item in html
 * @param {object} product Product from the API
 * @returns $productImg
 */
const createProductImg = product => {
    const $productImg = document.createElement('img')

    $productImg.setAttribute('src', product.imageUrl)
    $productImg.setAttribute('alt', product.altTxt)

    return $productImg
}

/**
 * Create the element product in html
 * @param {object} product Product from the API
 * @returns $productArticle
 */
const createProductArticle = product => {
    const $productArticle = document.createElement('article')
    
    const $productImg = createProductImg(product)

    const $productTitle = document.createElement('h3')
    $productTitle.classList.add('productName')
    $productTitle.textContent = product.name

    const $productDescription = document.createElement('p')
    $productDescription.classList.add('productDescription')
    $productDescription.textContent = product.description

    $productArticle.appendChild($productImg)
    $productArticle.appendChild($productTitle)
    $productArticle.appendChild($productDescription)
    
    return $productArticle
}

/**
 * Create the product's card in html
 * @param {object} product Product from the API
 * @returns $productCard
 */
const createProductCard = product => {

    const $productCard = document.createElement('a')
    $productCard.setAttribute('href', `./product.html?id=${product._id}`)

    const $productInfo = createProductArticle(product)

    $productCard.appendChild($productInfo)
    

    return $productCard
}


const main = async () => {
    const productData = await retrieveProductData()
    
    for (let i = 0; i < productData.length ; i++) {
        if (productData[i]) {
            $productsWrapper.appendChild(createProductCard(productData[i]))
        }
    }
}

main()