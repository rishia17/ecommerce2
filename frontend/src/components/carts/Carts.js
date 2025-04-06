

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Carts.css';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { MdDelete } from "react-icons/md";
import { updateCartCount } from '../../redux/slices/userLoginSlice';
import MobiKwiks from '../../image/MobiKwiks.png';


function Carts() {
  const { loginStatus, currentUser } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [productsList, setproductsList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [err, setErr] = useState('');
  const [zaakpayData, setZaakpayData] = useState(null);

  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const getAllProducts = async () => {
    try {
      let res;
      if (currentUser.userType === "user") {
        res = await axiosWithToken.get(`http://localhost:5500/user-api/mycart/${currentUser.userName}`);
      }
      if (res.data.message === 'all cart products') {
        setproductsList(res.data.payload);
      } else {
        setproductsList([]);
        setErr(res.data ? res.data.message : 'Failed to fetch cart products');
      }
    } catch (error) {
      setErr('Error fetching cart products');
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const getProductDetails = (productObj) => {
    navigate(`../product/${productObj.productId}`, { state: productObj });
  };

  const deleteProductFromCart = async (product) => {
    try {
      const productId = product.productId;
      const res = await axiosWithToken.post(`http://localhost:5500/user-api/mycart/${currentUser.userName}/${productId}`);
      if (res.data.message !== 'product deleted') {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr('Error deleting product');
    }
  };

  const calculateTotalPrice = (products) => {
    const total = products.reduce((sum, product) => {
      const discountedPrice = product.price - (product.price * (product.discount / 100));
      return sum + discountedPrice;
    }, 0);
    setTotalPrice(total);
  };

  useEffect(() => {
    if (productsList.length > 0) {
      calculateTotalPrice(productsList);
    } else {
      setTotalPrice(0);
    }
  }, [productsList]);

  const handlePayment = async () => {
    const obj = {
      userName: currentUser.userName,
      email: currentUser.email,
      amount: totalPrice
    };
    try {
      let res = await axios.post("http://localhost:5500/user-api/transact", obj);
      setZaakpayData({
        url: res.data.url,
        data: {
          ...res.data.data,
          checksum: res.data.checksum
        }
      });
    } catch (e) {
      console.error("Payment error", e);
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='card shadow'>
          <h2>Shopping cart</h2>
          {productsList.length === 0 ? (
            <p className='text-center'>No products found</p>
          ) : (
            <>
              <div className='container-display d-flex flex-column align-items-center' style={{ gap: "15px", flexGrow: "1" }}>
                {productsList.map((products) => (
                  <div className="container2" key={products.productId} style={{ width: "85%", height: "85%" }}>
                    <div className="card2 d-flex" style={{ borderRadius: "10px", border: "1px solid black", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", margin: "1%" }}>
                      <div className='card-side1 d-flex'>
                        <img
                          src={`${products.imageUrls[0]}`}
                          style={{ height: "200px", width: "250px", objectFit: "contain" }}
                          alt=''
                          onClick={() => getProductDetails(products)}
                        />
                      </div>
                      <div className="card-side2 d-flex flex-column align-items-start" style={{ marginLeft: "5%" }}>
                        <p
                          onClick={() => getProductDetails(products)}
                          style={{ marginTop: "5%", fontWeight: "500", textAlign: "left", fontSize: "1.2rem" }}
                        >
                          {`${products.name.substring(0, 40)}...`}
                        </p>
                        <div>
                          <Stack spacing={1}>
                            <Rating name="half-rating-read" defaultValue={Number(products.rating)} precision={0.5} readOnly />
                          </Stack>
                        </div>
                        <div className='product-brand'>
                          <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                            <span style={{ fontWeight: "bold" }}>Brand:</span> {`${products.brand}`}
                          </p>
                        </div>
                      </div>
                      <div className='prices-card d-flex flex-column align-items-center justify-content-center' style={{ marginLeft: "auto", marginRight: "0", width: "50%" }}>
                        <div className='card-price'>
                          <span style={{ fontSize: "28px", fontWeight: "600" }} onClick={() => getProductDetails(products)}>
                            {`\u20B9 ${Math.floor((products.price - (products.price * (products.discount / 100))) || 0)}`}
                          </span>
                        </div>
                        <div className='card-mrp' onClick={() => getProductDetails(products)}>
                          <p>
                            MRP: <span style={{ textDecoration: "line-through" }}>&#x20B9; {`${products.price}`}</span>
                            <span style={{ color: "#eb5757" }}>{`${products.discount}`}% off</span>
                          </p>
                        </div>
                      </div>
                      <div style={{ position: "relative", top: "10px", right: "15px" }}>
                        <MdDelete color='red' size='25px' onClick={() => deleteProductFromCart(products)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center" style={{ margin: '30px 100px 0 100px' }}>
          <div className="total-price" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            <span>Total Price: </span>
            <span>{`\u20B9 ${totalPrice.toFixed(2)}`}</span>
          </div>
          {loginStatus && currentUser.userType === "user" && (
            <button
              className="btn btn-warning"
              style={{ fontSize: '1.2rem', padding: '10px 20px', borderRadius: '8px' }}
              onClick={handlePayment}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>

      {/* ✅ ZAAKPAY PAYMENT FORM */}
      {zaakpayData && (
        <ZaakPay
          url={zaakpayData.url}
          data={zaakpayData.data}
          checksum={zaakpayData.data.checksum}
        />
      )}
    </div>
  );
}

export default Carts;

// ✅ PAYMENT FORM COMPONENT
const ZaakPay = ({ url, data, checksum }) => {
  const [btnName, setBtnName] = useState('Pay Now');

  return (
    <>
      <div className='main2'>
        <div className='center'>
          <img width={300} src={MobiKwiks} alt="MobiKwik" />
          <p>Payment Gateway integration</p>
        </div>
        <div className='border px-5 py-4'>
          <form className='' action={url} method="post">
            {Object.entries(data)?.map(([key, value]) => (
              <div key={key}>
                <label className='mt-2'>{(key).toUpperCase()}:</label>
                <div className='col-12 center'>
                  <input type="text" name={key} value={value} readOnly />
                </div>
              </div>
            ))}
            <input type="hidden" name="checksum" value={checksum} />
            <div className='col-12 center'>
              <button className='w-100 px-4' type="submit">{btnName}</button>
            </div>
          </form>
        </div>
      </div>
      <p className='mt-4'>@codesense24</p>
    </>
  );
};
