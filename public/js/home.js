import { showNotification } from "./notification.js";

let products = document.getElementsByClassName('productImage');

for (let index = 0; index < products.length; index++) {
    const element = products[index];
    element.addEventListener('click', handleProductClick);
}

let productName;

async function handleProductClick(e) {
    productName = e.target.name;

    // await fetchproductData(productName);
}

async function fetchproductData(productName) {

    await fetch('/showProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName })
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    window.location.href = 'product';
                });
            }
        } else if (response.status === 500) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                });
            }
        }
    }).catch((err) => {
        alert('Internal Server Error');
        console.log(err);
    });
}


// console.log(addtoCart);

let addtoCart = document.getElementsByClassName('addtoCart');

for (let index = 0; index < addtoCart.length; index++) {
    const element = addtoCart[index];
    element.addEventListener('click', handleaddtoCart);
}

async function handleaddtoCart(e) {
    productName = e.target.name;

    await fetchaddtoCart(productName);
}

async function fetchaddtoCart(productName) {

    await fetch('/addtoCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName })
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    // alert(data.msg);
                    showNotification(data.msg, 1);
                });
            }
        } else if (response.status === 500) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    // alert(data.msg);
                    showNotification(data.msg, 0);
                });
            }
        } else if (response.status === 401) {
            if (contentType && contentType.includes('application/json')) {
                // window.location.href = "login";
                showNotification('Login plz', 0);
            }
        }
    }).catch((err) => {
        // alert('Internal Server Error');
        // console.log(err);
        showNotification('Internal Server Error', 0);
    });
}


let srchInput = document.getElementById('srchInput');
let srchBtn = document.getElementById('srchBtn');

srchBtn.addEventListener('click', ok);

async function ok(e) {
    e.preventDefault();
    // console.log(srchInput.value);

    // await srchProduct(srchInput.value)
}

async function srchProduct(name) {

    await fetch('/srch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ srch: name })
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    window.location.href = '/search';
                });
            }
        } else if (response.status === 500) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    // alert(data.msg);
                    showNotification(data.msg, 0);
                });
            }
        } else if (response.status === 401) {
            if (contentType && contentType.includes('application/json')) {
                showNotification('Login plz', 0);
            }
        } else if (response.status === 404) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    showNotification(data.msg, 0);
                });
            }
        }
    }).catch((err) => {
        // alert('Internal Server Error');
        // console.log(err);
        showNotification('Internal Server Error', 0);
    });
}















// Get references to the image and the dropdown menu
const userImage = document.getElementById('userImage');
const dropdownMenu = document.getElementById('dropdownMenu');

// Flag to keep track of the dropdown state
let isDropdownOpen = false;

// Function to toggle the dropdown visibility
function toggleDropdown() {
    if (isDropdownOpen) {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
    // Update the state of the dropdown
    isDropdownOpen = !isDropdownOpen;
}

// Add a click event listener to the image
userImage.addEventListener('click', function (event) {
    // Prevent event propagation to avoid triggering the document click event
    event.stopPropagation();
    toggleDropdown();
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', function (event) {
    if (isDropdownOpen && !dropdownMenu.contains(event.target) && event.target !== userImage) {
        toggleDropdown();
    }
});
