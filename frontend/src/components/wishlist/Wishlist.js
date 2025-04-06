import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { MdDelete } from "react-icons/md";
import './Wishlist.css';


function Wishlist() {
  const { currentUser } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [err, setErr] = useState('');
  const token = sessionStorage.getItem('token');

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const getWishlistProducts = async () => {
    try {
      const res = await axiosWithToken.get(`http://localhost:5500/user-api/wishlist/${currentUser.userName}`);
      if (res.data.message === 'all wishlist products') {
        setWishlist(res.data.payload);
      } else {
        setWishlist([]);
        setErr(res.data.message || 'Failed to fetch wishlist products');
      }
    } catch (error) {
      setErr('Error fetching wishlist');
    }
  };

  useEffect(() => {
    getWishlistProducts();
  }, []);

  const getProductDetails = (productObj) => {
    navigate(`../product/${productObj.productId}`, { state: productObj });
  };

  const deleteFromWishlist = async (product) => {
    try {
      const res = await axiosWithToken.post(`http://localhost:5500/user-api/wishlist/${currentUser.userName}/${product.productId}`);
      if (res.data.message === 'product removed from wishlist') {
        console.log('hiiiii')
        // Refresh wishlist
        getWishlistProducts();
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      setErr('Error removing product');
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='card shadow'>
          <h2>My Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className='text-center'>No products in wishlist</p>
          ) : (
            <div className='container-display d-flex flex-column align-items-center' style={{ gap: "15px", flexGrow: "1" }}>
              {wishlist.map((product) => (
                <div className="container2" key={product.productId} style={{ width: "85%", height: "85%" }}>
                  <div className="card2 d-flex" style={{ borderRadius: "10px", border: "1px solid black", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)", margin: "1%" }}>
                    <div className='card-side1 d-flex'>
                      <img 
                        src={product.imageUrls[0]} 
                        style={{ height: "200px", width: "250px", objectFit: "contain" }} 
                        alt='' 
                        onClick={() => getProductDetails(product)}
                      />
                    </div>
                    <div className="card-side2 d-flex flex-column align-items-start" style={{ marginLeft: "5%" }}>
                      <p 
                        onClick={() => getProductDetails(product)} 
                        style={{ marginTop: "5%", fontWeight: "500", textAlign: "left", fontSize: "1.2rem" }}
                      >
                        {`${product.name.substring(0, 40)}...`}
                      </p>
                      <Stack spacing={1}>
                        <Rating name="half-rating-read" defaultValue={Number(product.rating)} precision={0.5} readOnly />
                      </Stack>
                      <div className='product-brand'>
                        <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                          <span style={{ fontWeight: "bold" }}>Brand:</span> {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className='prices-card d-flex flex-column align-items-center justify-content-center' style={{ marginLeft: "auto", marginRight: "0", width: "50%" }}>
                      <div className='card-price'>
                        <span style={{ fontSize: "28px", fontWeight: "600" }} onClick={() => getProductDetails(product)}>
                          {`\u20B9 ${Math.floor(product.price - (product.price * (product.discount / 100)))}`}
                        </span>
                      </div>
                      <div className='card-mrp' onClick={() => getProductDetails(product)}>
                        <p>
                          MRP: <span style={{ textDecoration: "line-through" }}>&#x20B9; {product.price}</span>
                          <span style={{ color: "#eb5757" }}> {product.discount}% off</span>
                        </p>
                      </div>
                    </div>
                    <div style={{ position: "relative", top: "10px", right: "15px" }}>
                      <MdDelete color='red' size='25px' onClick={() => deleteFromWishlist(product)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
