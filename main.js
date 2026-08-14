// ======================================================
// BLOOM & BLOSSOM
// CART + FIREBASE + ORDER SYSTEM
// ======================================================


// ======================================================
// FIREBASE
// ======================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// YOUR FIREBASE CONFIG
// ======================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJc6nZqv2QiZvWn8hcYL-gc3BxeQ7OOiU",
  authDomain: "dendenbakeshop.firebaseapp.com",
  databaseURL: "https://dendenbakeshop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dendenbakeshop",
  storageBucket: "dendenbakeshop.firebasestorage.app",
  messagingSenderId: "690052070635",
  appId: "1:690052070635:web:5e831b4d9182c9476952ae",
  measurementId: "G-CTK39LWKL6"
};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

console.log("Firebase initialized!");


// ======================================================
// CART
// ======================================================

let cart = [];


// ======================================================
// ADD TO CART
// ======================================================

window.addToCart = function(name, price) {

    price = Number(price);

    const existing =
        cart.find(item => item.name === name);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    alert(name + " added to cart!");

};


// ======================================================
// UPDATE CART
// ======================================================

function updateCart() {

    const cartCount =
        document.getElementById("cartCount");

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (cartCount) {

        cartCount.textContent = totalItems;

    }

    displayOrderSummary();

}


// ======================================================
// DISPLAY ORDER SUMMARY
// ======================================================

function displayOrderSummary() {

    const orderItems =
        document.getElementById("orderItems");

    const totalPrice =
        document.getElementById("totalPrice");

    if (!orderItems || !totalPrice) {
        return;
    }

    if (cart.length === 0) {

        orderItems.innerHTML =
            "No flowers selected.";

        totalPrice.textContent =
            "₱0";

        return;

    }

    let html = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;

        total += subtotal;

        html += `
            <p>
                ${item.name}
                × ${item.quantity}
                — ₱${subtotal.toLocaleString()}
            </p>
        `;

    });

    orderItems.innerHTML = html;

    totalPrice.textContent =
        "₱" + total.toLocaleString();

}


// ======================================================
// CALCULATE TOTAL
// ======================================================

function calculateTotal() {

    return cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );

}


// ======================================================
// SHOW CART
// ======================================================

window.showCart = function() {

    const modal =
        document.getElementById("cartModal");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!modal) return;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "₱0";

    } else {

        let html = "";

        let total = 0;


        cart.forEach((item, index) => {

            const subtotal =
                item.price * item.quantity;

            total += subtotal;


            html += `
                <div class="cart-item">

                    <div>
                        <strong>
                            ${item.name}
                        </strong>

                        <br>

                        Quantity:
                        ${item.quantity}

                        <br>

                        ₱${item.price.toLocaleString()}
                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})">

                        Remove

                    </button>

                </div>
            `;

        });


        cartItems.innerHTML = html;

        cartTotal.textContent =
            "₱" + total.toLocaleString();

    }


    modal.style.display = "flex";

};


// ======================================================
// CLOSE CART
// ======================================================

window.closeCart = function() {

    const modal =
        document.getElementById("cartModal");

    if (modal) {

        modal.style.display = "none";

    }

};


// ======================================================
// REMOVE ITEM
// ======================================================

window.removeItem = function(index) {

    cart.splice(index, 1);

    updateCart();

    showCart();

};


// ======================================================
// GO TO ORDER
// ======================================================

window.goToOrder = function() {

    closeCart();

    const order =
        document.getElementById("order");

    if (order) {

        order.scrollIntoView({
            behavior: "smooth"
        });

    }

};


// ======================================================
// CLOSE SUCCESS
// ======================================================

window.closeSuccess = function() {

    const modal =
        document.getElementById("successModal");

    if (modal) {

        modal.style.display = "none";

    }

};


// ======================================================
// PLACE ORDER
// ======================================================

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ------------------------------------------
            // CHECK CART
            // ------------------------------------------

            if (cart.length === 0) {

                alert(
                    "Please add a flower to your cart first."
                );

                return;

            }


            // ------------------------------------------
            // GET BUYER DATA
            // ------------------------------------------

            const buyerName =
                document
                    .getElementById("buyerName")
                    .value
                    .trim();


            const buyerEmail =
                document
                    .getElementById("buyerEmail")
                    .value
                    .trim();


            const buyerPhone =
                document
                    .getElementById("buyerPhone")
                    .value
                    .trim();


            const buyerAddress =
                document
                    .getElementById("buyerAddress")
                    .value
                    .trim();


            const deliveryDate =
                document
                    .getElementById("deliveryDate")
                    .value;


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            const total =
                calculateTotal();


            // ------------------------------------------
            // CREATE FIREBASE DATA
            // ------------------------------------------

            const orderData = {

                buyer: {

                    name: buyerName,

                    email: buyerEmail,

                    phone: buyerPhone,

                    address: buyerAddress

                },

                items: cart.map(item => ({

                    name: item.name,

                    price: item.price,

                    quantity: item.quantity,

                    subtotal:
                        item.price *
                        item.quantity

                })),

                totalAmount: total,

                deliveryDate: deliveryDate,

                message: message,

                status: "Pending",

                createdAt: serverTimestamp()

            };


            // ------------------------------------------
            // BUTTON
            // ------------------------------------------

            const button =
                orderForm.querySelector(
                    ".submit-btn"
                );


            if (button) {

                button.disabled = true;

                button.textContent =
                    "Saving Order...";

            }


            // ------------------------------------------
            // SAVE TO FIREBASE
            // ------------------------------------------

            try {

                const docRef =
                    await addDoc(
                        collection(
                            db,
                            "orders"
                        ),
                        orderData
                    );


                console.log(
                    "ORDER SAVED!"
                );

                console.log(
                    "Firebase Document ID:",
                    docRef.id
                );


                // --------------------------------------
                // SUCCESS
                // --------------------------------------

                const success =
                    document.getElementById(
                        "successModal"
                    );


                if (success) {

                    success.style.display =
                        "flex";

                }


                // --------------------------------------
                // CLEAR FORM
                // --------------------------------------

                orderForm.reset();


                // --------------------------------------
                // CLEAR CART
                // --------------------------------------

                cart = [];

                updateCart();


            } catch (error) {

                console.error(
                    "FIREBASE ERROR:",
                    error
                );


                alert(
                    "Firebase could not save the order.\n\n" +
                    error.message
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "🌸 Place Order";

                }

            }

        }
    );

}


// ======================================================
// START
// ======================================================

updateCart();

console.log(
    "Bloom & Blossom is ready!"
);