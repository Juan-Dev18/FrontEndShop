import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { setCustomers, setSelectedUser } from "../../Redux/store";
import { GET_CUSTOMERS } from "../../Data/queries";
import { useNavigate } from "react-router-dom";
import "./loginStyle.css";


//Juan Carraco: I need to create a login page to select a user. It is a very simple one, to focus on product and order.

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customers = useSelector((state) => state.customers.customers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const { data, loading, error } = useQuery(GET_CUSTOMERS);

    useEffect(() => {
        if (data) {
            dispatch(setCustomers(data.customers));
        }
    }, [data, dispatch]);

    const handleStart = () => {
        if (!selectedCustomer) return alert("Seleccione un usuario");

        dispatch(setSelectedUser(selectedCustomer));
        navigate("/Product");
    };

    return (
        <div className="loginClass">
            <div className="secondloginClass">
                <h1>Login</h1>

                {loading && <p>Loading...</p>}
                {error && <p>Error on Clients Load</p>}

                <select
                    className="elementsClass"
                    onChange={(e) => setSelectedCustomer(customers.find(c => c.customerId === parseInt(e.target.value)))}
                >
                    <option value="">Select a User</option>
                    {customers?.length > 0 ? (
                        customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>Loading Clients...</option>
                    )}
                </select>

                <button
                    onClick={handleStart}
                    className="buttonClass"
                >
                    Iniciar
                </button>
            </div>
        </div>
    );
};

export default Login;
