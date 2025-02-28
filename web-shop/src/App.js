import Login from "./Pages/Login";
import Product from "./Pages/Products";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import { client } from "./Data/clientApi";
import ShoppingCart from "./Pages/Shop";

//Juan Carrasco: I use Reactjs.Wiki to clarify doubts about the use of React. The CSS design I applied is too simple, I hope it is not a problem, I focused a lot on functionality.

function App() {
  return (
    <ApolloProvider client={client}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/product" element={<Product />} />
            <Route exact path="/shopCart" element={<ShoppingCart />} />
          </Routes>
        </Router>
    </ApolloProvider>
  );
}

export default App;
