import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { addToCart, setProducts, updateStock, clearCart } from '../../Redux/store';
import { GET_PRODUCTS } from '../../Data/queries';
import Button from '../../Components/button';
import Input from '../../Components/input';
import { useNavigate } from "react-router-dom";
import './productStyle.css';


const Product = () => {
    const pageSize = 10;
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const offset = (page - 1) * pageSize;
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);
    const cart = useSelector(state => state.cart);
    const userSelected = useSelector(state => state.customers.selectedUser);
    const [quantity, setQuantity] = useState({});

    const { data, loading, error } = useQuery(GET_PRODUCTS, {
        variables: { offset, pageSize }
    });

    useEffect(() => {
        if (data) {
            dispatch(setProducts(data.products));
        }
        dispatch(clearCart());
    }, [data, dispatch]);

    const handleAddToCart = (product) => {

        let qty = parseInt(quantity[product.productId] || 1);

        if (qty > product.stock) {
            alert(`Not enough stock available for ${product.name}! There would only be ${product.stock} left in stock.`);
            return;
        }
                
        dispatch(updateStock({ productId: product.productId, quantity: qty }));
        dispatch(addToCart({ ...product, quantity: qty || 1 }));


        console.log("Product added to cart", cart);
        console.log("User selected", userSelected);

    };

    const goToCart = () => {
        navigate("/shopCart");
    }

    return (
        <div className="catalog-container">
            <h1>Product Catalog</h1>
            <Button onClick={goToCart}>Cart</Button>
            {loading ? <p>Loading products...</p> : (
                <div className="product-list">
                    {products.map(product => (
                        <div key={product.productId} className="product-item">
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <div className="product-detail">
                                    <p className="item-no-des">Item No: {product.productId} |</p>
                                    <p className="stock" style={{ color: product.stock > 50 ? 'green' : 'red' }}>
                                        {product.stock} in stock
                                    </p></div>

                                <p className="item-no-des">{product.description}</p>
                            </div>
                            <div className="product-controls">
                                <p className="price">€{product.unitPrice}</p>
                                <div className="cart-controls">
                                    <Input
                                        type="number"
                                        min={1}
                                        value={quantity[product.productId] || ""}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? "" : Math.max(1, parseInt(e.target.value, 10));
                                            setQuantity({ ...quantity, [product.productId]: value });
                                        }}
                                    />
                                    <Button onClick={() => handleAddToCart(product)}>+</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && <p>Error on Product Load</p>}
            <div className="pagination">
                <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</Button>
                <span>Page {page}</span>
                <Button onClick={() => setPage(prev => prev + 1)}>Next</Button>
            </div>
        </div>
    );
};

export default Product;
