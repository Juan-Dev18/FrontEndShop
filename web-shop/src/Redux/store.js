import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


//Juan Carrasco: This is my first time using Redux, what I did, I did by researching and testing, so I'm not sure if it's the optimal way to apply it (Im Sure not :C ).

const initialCustomer = {
  customers: [],
  selectedUser: null
};

const initialProduct = {
  products: []
};

const initialCart = {
  cart: []
};

const customerSlice = createSlice({
  name: "customers",
  initialState: initialCustomer,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setCustomers, setSelectedUser } = customerSlice.actions;


const productSlice = createSlice({
  name: 'products',
  initialState: initialProduct,
  reducers: {
    setProducts: (state, action) => { state.products = action.payload; },
    updateStock: (state, action) => {
      const { productId, quantity } = action.payload;
      state.products = state.products.map(product =>
        product.productId === productId
          ? { ...product, stock: Math.max(product.stock - quantity, 0) }
          : product
      );
    }
  }
});
export const { setProducts, updateStock } = productSlice.actions;


const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCart,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.productId === product.productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.cart.find((item) => item.productId === productId);
      if (product) {
        product.quantity = quantity;
      }
    },
    sendCart: (state, action) => {
      state.cart = action.payload;

     
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.productId !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

//--------------------------------------------------------------------------------


const persistConfig = {
  key: "root",
  storage,
  blacklist: ["products"],
};

const rootReducer = combineReducers({
  customers: customerSlice.reducer,
  products: productSlice.reducer,
  cart: cartSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export const persistor = persistStore(store);
