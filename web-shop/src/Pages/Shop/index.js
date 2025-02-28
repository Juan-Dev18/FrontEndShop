import React from "react";
import { useMutation } from "@apollo/client";
import { removeFromCart, updateQuantity, clearCart } from '../../Redux/store';
import { useSelector, useDispatch } from "react-redux";
import Input from "../../Components/input";
import { SET_ORDER } from "../../Data/mutations";
import "./shopStyle.css";

const ShoppingCart = () => {
    const cartItems = useSelector((state) => state.cart.cart);
    const selectedUser = useSelector((state) => state.customers.selectedUser);
    const dispatch = useDispatch();
    const [insertOrder, { loading, error}] = useMutation(SET_ORDER);
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    
    const handleProcessOrder = async () => {
        if (!selectedUser) {
            alert("Not User Selected");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const orderData = {
            order: {
                customer: {
                    customerId: selectedUser.customerId
                }
            },
            orderDetails: cartItems.map((item) => ({
                product: { productId: item.productId },
                quantity: parseInt(item.quantity)
            }))
        };

        try {

            //Juan Carrasco: For some reason the information is not sent, it seems that the model is wrong, but I can't find the problem.

            // console.log("Sending To GraphQL:", JSON.stringify(orderData, null, 2));
            const response = await insertOrder({ variables: { request: orderData } });
            console.log("Order Response:", response);

            if (response.data.insertOrder.message === "OK") {
                alert("Order placed successfully!");
                dispatch(clearCart());
            } else {
                alert(`${response.data.insertOrder.message}. Error placing order.`);
            }
        } catch (err) {
            console.error("GraphQL Error:", err);
            alert("An error occurred while placing the order.");
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-content">
                <h2>My shopping cart</h2>
                <table>
                    <thead>
                        <tr>
                            <th className="product-th">Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((product) => (
                            <tr key={product.productId}>
                                <td>
                                    <div className="cart-info">
                                        <p>{product.name}</p>
                                        <p>Item No: {product.productId}</p>
                                        <button className="btnDeleteCart" onClick={() => dispatch(removeFromCart(product.productId))}>🗑 Delete</button>
                                    </div>
                                </td>
                                <td>€{parseFloat(product.unitPrice).toFixed(2)}</td>
                                <td>
                                    <Input
                                        type="number"
                                        value={product.quantity}
                                        min={1}
                                        onChange={(e) => dispatch(updateQuantity({ productId: product.productId, quantity: parseInt(e.target.value) || 1 }))}
                                    />
                                </td>
                                <td>€ {((parseFloat(product.unitPrice) || 0) * (parseInt(product.quantity) || 0)).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="cart-summary">
                <h2>Shopping cart details</h2>
                <div className="summary-details">
                    <p>Items ({totalItems} units)</p>
                    <p>€ {(parseFloat(totalPrice) || 0).toFixed(2)}</p>
                </div>
                <div className="summary-total">
                    <p>Total</p>
                    <p>€ {(parseFloat(totalPrice) || 0).toFixed(2)}</p>
                </div>
                <button className="process-order" onClick={handleProcessOrder} disabled={loading} >
                    {loading ? "Processing..." : "Process Order"}
                </button>
                {error && <p style={{ color: "red" }}>Error placing order.</p>}
            </div>
        </div>
    );
};

export default ShoppingCart;
