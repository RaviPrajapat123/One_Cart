import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { shopDataContex } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin5Line } from "react-icons/ri";
import CartTotal from '../components/CartTotal';
import emptyCart from "../assets/noOrder.png"
function Cart() {
  const { product, currency, cartItem, updateQuantity } = useContext(shopDataContex);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item]
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

 return (
  <div className='w-full min-h-screen pb-[100px] p-4 sm:p-6 md:p-8 bg-gradient-to-l from-[#141414] to-[#0c2025]'>
    <div className='text-center mt-20'>
      <Title text1={'YOUR'} text2={"CART"} />
    </div>

    {cartData.length === 0 ? (
      // ✅ Empty Cart Display
      <div className='flex flex-col items-center justify-center mt-20'>
        <img
          src={emptyCart}
          alt="Empty Cart"
          className='w-[250px] h-[250px] object-contain'
        />
        <p className='text-xl text-white mt-4'>Your cart is empty</p>
        <button
          className='mt-6 px-6 py-2 bg-[#518080] hover:bg-[#3b6e6e] text-white rounded-md'
          onClick={() => navigate("/collection")}
        >
          Shop Now
        </button>
      </div>
    ) : (
      <>
        {/* ✅ Cart Items List */}
        <div className='w-full flex flex-col gap-5 mt-10'>
          {cartData.map((item, i) => {
            const productData = product.find((product) => product._id === item._id);
            return (
              <div key={i} className='w-full border-t border-b py-3'>
                <div className='w-full flex flex-col md:flex-row md:items-center gap-4 bg-[#51808048] p-4 rounded-lg relative'>
                  <img src={productData.image1} alt="" className='w-24 h-24 rounded-md object-cover mx-auto md:mx-0' />
                  <div className='flex flex-col justify-center text-center md:text-left'>
                    <p className='text-xl md:text-2xl text-[#f3f9fc]'>{productData.name}</p>
                    <div className='flex items-center justify-center md:justify-start gap-4 mt-2'>
                      <p className='text-lg text-[#aaf4e7]'>Price: {currency} {productData.price}</p>
                      <p className='flex items-center gap-2 text-lg text-[#aaf4e7]'> Size :
                        <span className='w-10 h-10 flex items-center justify-center bg-[#518080b4] text-white rounded-md border border-[#9ff9f9]'>
                          {item.size}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-center gap-2 md:absolute md:right-[100px] mt-3 md:mt-0'>
                    <p className='text-lg text-[#aaf4e7]'>Quantity :</p>
                    <input
                      type="number"
                      min={1}
                      defaultValue={item.quantity}
                      onChange={(e) =>
                        e.target.value === "" || e.target.value === "0"
                          ? null
                          : updateQuantity(item._id, item.size, Number(e.target.value))
                      }
                      className='w-16 md:w-20 px-2 py-1 text-white text-lg bg-[#518080b4] border border-[#9ff9f9] rounded-md'
                    />
                  </div>
                  <div className='flex items-center justify-center md:absolute md:right-4 top-0 bottom-0 my-auto h-fit'>
                    <RiDeleteBin5Line
                      className='text-[#9ff9f9] w-6 h-6 cursor-pointer'
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Total and Checkout */}
        <div className='flex justify-center md:justify-start items-center mt-10 pb-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <div className='flex justify-center sm:justify-start px-4'>
              <button
                className='text-lg bg-[#51808048] hover:bg-slate-600 text-white px-6 py-3 mt-5 rounded-2xl border border-[#80808049] w-full sm:w-auto'
                onClick={() => navigate("/placeorder")}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
);

}

export default Cart;
