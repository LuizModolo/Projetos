const olClass = '.cart__items';
const pCountClass = '.total-price';

function getComputerApi(result) {
  return result.reduce((obj, actual) => {
    let finalObj = obj;
    finalObj = [...finalObj, { sku: actual.id, name: actual.title, image: actual.thumbnail }];
    return finalObj;
  }, []);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveData() {
  const ol4 = document.querySelector(olClass);
  const saveItens = localStorage.setItem('texto', ol4.innerHTML);
  return saveItens;
}

function saveData2() {
  const paragraphPrice = document.querySelector(pCountClass);
  const ol2 = document.getElementsByClassName('cart__items');
  console.log(ol2.hasChildNodes);
  if (ol2[0].childNodes.length === 0) {
    paragraphPrice.innerText = 0;
  }
  const saveCount = localStorage.setItem('count', paragraphPrice.innerText);
  return saveCount;
}

function cartItemClickListener(event) {
  const ol2 = document.querySelector(olClass);
  const pPrice = document.querySelector(pCountClass);
  const priceSplit = event.target.innerText.split('$');
  pPrice.innerText = (parseFloat(pPrice.innerText) - parseFloat(priceSplit[1])).toFixed(2);
  event.target.parentNode.removeChild(event.target);
  ol2.addEventListener('change', saveData());
  ol2.addEventListener('change', saveData2());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createPriceParagraph() {
  const sectionDir = document.querySelector('#soma');
  const pPrice = document.createElement('span');
  pPrice.classList.add('total-price');
  sectionDir.appendChild(pPrice);
  pPrice.innerText = 0;
}

async function getCartApi(productID) {
  const dataCart = await fetch(`https://api.mercadolibre.com/items/${productID}`);
  const dataFull2 = await dataCart.json();
  const ol2 = document.querySelector(olClass);
  ol2.appendChild(createCartItemElement(
    { sku: dataFull2.id, name: dataFull2.title, salePrice: dataFull2.price },
    ));
  const pPric = document.getElementsByClassName('total-price');
  pPric[0].innerText = (parseFloat(pPric[0].innerText) + parseFloat(dataFull2.price)).toFixed(2);
  ol2.addEventListener('change', saveData());
  ol2.addEventListener('change', saveData2());
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  if (element === 'button') {
    e.className = className;
    e.innerText = innerText;
    e.addEventListener('click', (event) => {
      getCartApi(event.target.parentNode.querySelector('.item__sku').innerText);
    });
    return e;
  }
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function createLoadingParagraph() {
  const body = document.querySelector('body');
  const pLoading = document.createElement('h1');
  pLoading.classList.add('loading');
  body.appendChild(pLoading);
  pLoading.innerText = 'Loading';
}

function removeLoadingParagraph() {
  const pLoading = document.querySelector('h1');
  pLoading.remove();
}

async function getFullApi() {
  createLoadingParagraph();
  const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataFull = await data.json();
  const arrayProdutos = getComputerApi(dataFull.results);
  arrayProdutos.forEach((product) => {
    const printProduct = createProductItemElement(product);
    const sectionProduct = document.querySelector('.items');
    sectionProduct.appendChild(printProduct);
  });
  removeLoadingParagraph();
}

function reloadItem() {
  const ol3 = document.querySelector(olClass);
  ol3.innerHTML = localStorage.getItem('texto');
  const li = document.querySelectorAll('.cart__item');
  li.forEach((singleLi) => {
    singleLi.addEventListener('click', cartItemClickListener);
  });
}

function reloadItem2() {
  const paragraphPrice = document.querySelector(pCountClass);
  if (localStorage.getItem('count')) {
    paragraphPrice.innerText = localStorage.getItem('count');
  }
}

function clearButton() {
  const clearBut = document.querySelector('.empty-cart');
  const paragraphPrice = document.querySelector(pCountClass);
  const ol5 = document.querySelector(olClass);
  clearBut.addEventListener('click', () => {
    while (ol5.firstChild) {
      ol5.removeChild(ol5.firstChild);
    }
    paragraphPrice.innerText = 0;
  });
}

window.onload = () => {
  getFullApi();
  createPriceParagraph();
  reloadItem();
  reloadItem2();
  clearButton();
  const carrinho = document.getElementById('carrinho');
  carrinho.addEventListener('click', () => {
  const cart = document.getElementsByClassName('cart');
    if (cart[0].style.display === 'none') {
      cart[0].style.display = 'flex';
    } else {
      cart[0].style.display = 'none';
    }
  });
 };
