import { useState, useEffect } from 'react';
import AppNavBar from './components/AppNavBar';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { UserProvider } from './UserContext'

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductView from './pages/ProductView';
import Products from './pages/Products';
import Orders from './pages/Orders';
import UserOrders from './pages/UserOrders';
import AddProduct from './pages/AddProduct'
import CategoryView from './pages/CategoryView';

import NotFound from './pages/Error';

function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  const unsetUser = () => {
    localStorage.clear()
  }

  
  useEffect(() => {

    fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {

      console.log(data);

      if(typeof data._id !== "undefined") {

        setUser({
          id: data._id,
          isAdmin: data.isAdmin
        });
      } else {

        setUser({
          id: null,
          isAdmin: null
        })
      }
    })

  },[])

  console.log(user);

  return (
    <UserProvider value={{ user, setUser, unsetUser}}>
      <Router>
        <AppNavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/myorders" element={<UserOrders />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route path="/products/category/:category" element={<CategoryView />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
