import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Login from "./pages/Login";

import Nav from "./components/Nav";
import { useUser, UserProvider } from "./context/UserContext";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import ShopContext from "./context/ShopContext";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();
  // const{currentUser}=useUser()
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
const { currentUser, loading } = useUser();

if (loading) {
  return <div className="text-white p-10">Loading...</div>;
}
  return (
    <>
     {!shouldHideNavbar && currentUser && <Nav />}


      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productdetail/:productId"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placeorder"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ShopContext>

        <AppContent />
        </ShopContext>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
