import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

export const shopDataContex = createContext();

function ShopContext({ children }) {
    const [product, setProudct] = useState([]);
    const { currentUser } = useUser()
    const [cartItem, setCartItem] = useState({});
    const currency = "₹";
    const delivery_fee = 40;
    const [Search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const getproducts = async () => {
        try {
            const result = await axios.get("http://localhost:3000/allProducts",{withCredentials:true});
            // console.log(result.data.data);
            setProudct(result.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const addtoCart = async (itemId, size) => {
        if (!size) {
            alert("Please Select Product Size");
            return;
        }
        let cartData = structuredClone(cartItem);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);
        if (currentUser) {
            try {
                let res = await axios.post("http://localhost:3000/addToCart", { itemId, size }, { withCredentials: true })
                if (res.data.success) {
                    alert(res.data.message)
                }
                else {
                    alert("Something went Wrong!")
                }
            } catch (error) {
                console.log(error)
            }
        }
        
    };

    const getUserCard = async () => {
            try {
                        const result=await axios.get('http://localhost:3000/userCart',{withCredentials:true})
                        setCartItem(result.data.cartData)
            } catch (error) {
                    console.log(error)
            }
        }

        const updateQuantity=async(itemId,size,quantity)=>{
            let cartData=structuredClone(cartItem)
            cartData[itemId][size]=quantity
            setCartItem(cartData)
            if(currentUser){

                try {
                        await axios.post("http://localhost:3000/updateCart",{itemId,size,quantity},{withCredentials:true})
                } catch (error) {
                    console.log(error)
                }
            }
        }
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItem) {
            for (const item in cartItem[items]) {
                try {
                    if (cartItem[items][item] > 0) {
                        totalCount += cartItem[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    };

    const getCartAmount=()=>{
        let totalAmount=0
        for(const items in cartItem){
            let itemInfo=product.find((product)=>product._id===items)
            for(const item in cartItem[items]){

                try {
                    if(cartItem[items][item]>0){
                        totalAmount+=itemInfo.price * cartItem[items][item]
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        return totalAmount
    }

    useEffect(() => {
        getproducts();
    }, []);

    useEffect(()=>{
        getUserCard()
    },[])



    const value = {
        product,
        currency,
        delivery_fee,
        getproducts,
        Search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addtoCart,
        getCartCount,
        setCartItem,
        updateQuantity,
        getCartAmount
    };

    return (
        <shopDataContex.Provider value={value}>
            {children}
        </shopDataContex.Provider>
    );
}

export default ShopContext;
