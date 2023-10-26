let deleteBtn = document.getElementsByClassName('delete');

console.log(deleteBtn);

for (let index = 0; index < deleteBtn.length; index++) {
    const element = deleteBtn[index];
    element.addEventListener('click', handleDeleteClick);
}

// deleteBtn.addEventListener('click', deleteItem);

async function handleDeleteClick(e) {

    let productName = e.target.name;

    if (window.confirm('Are you sure want to delete?')) {
        await deleteItem(productName);
    } else {
        console.log('Delete Canclled');
    }

}

async function deleteItem(productName) {

    await fetch('/deleteCart', {
        method: 'POST',
        body: JSON.stringify({ productName }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 400) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                });
            }
        } else if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                    window.location.reload();
                });
            }
        } else if (response.status === 500) {
            alert('Internal Server Error');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
}

let quantity = document.getElementsByClassName('quantity');

console.log(quantity);

for (let index = 0; index < quantity.length; index++) {
    const element = quantity[index];
    element.addEventListener('change', handleUpdateClick);
}

async function handleUpdateClick() {
    console.log(this.name);
    console.log(this.value);

    await updateItem(this.name, this.value);
}

async function updateItem(name, value) {

    await fetch('/updateCart', {
        method: 'POST',
        body: JSON.stringify({ name: name, value: value }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 400) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                });
            }
        } else if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                    window.location.reload();
                });
            }
        } else if (response.status === 500) {
            alert('Internal Server Error');
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
}



let checkOut = document.getElementById('submit');

let tp = document.getElementById('tp');

// checkOut.addEventListener('click', chkout);

async function chkout() {
    alert(tp.innerHTML);

    await fetch('/addOrder', {
        method: 'POST',
        body: JSON.stringify({tp:tp.innerHTML}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.status === 400) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                });
            }
        } else if (response.status === 200) {
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    alert(data.msg);
                    window.location.href = '/orders';
                });
            }
        } else if (response.status === 500) {
            alert('Internal Server Error');
        }
    }).catch((error) => {
        console.error('Error:', error);
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

