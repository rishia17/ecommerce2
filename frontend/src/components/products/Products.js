import { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import './Products.css';
import * as React from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import queryString from 'query-string';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Products() {
  const { loginStatus, currentUser } = useSelector((state) => state.userLogin);
  const [productsList, setProductsList] = useState([]);
  const token = sessionStorage.getItem('token');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const popupRef = useRef(null);
  let dispatch = useDispatch();
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });
  let [err, setErr] = useState('');

  const getAllProducts = async () => {
    let res;
    if (filteredProducts.length !== 0) {
      getFilteredProducts(filteredProducts);
    } else {
      if (currentUser.userType === 'admin') res = await axiosWithToken.get(`http://localhost:5500/admin-api/products`)

      else res = await axiosWithToken.get(`http://localhost:5500/user-api/products`)

      if (res.data.message === 'all products') {
        setProductsList(res.data.payload)
      } else {
        setErr(res.data.message)
      }
    }
  }

  const addToWishlist = async (productId) => {
    if (!loginStatus) {
      navigate('/signin')
    }
    else {
      let wishlistObj = {
        userName: currentUser.userName,
        productId: productId
      };

      if (currentUser.userType === 'user') {
        const res = await axiosWithToken.post(`http://localhost:5500/user-api/wishlist`, wishlistObj);
        if (res.data.message === 'product added to wishlist') {
          // Optional: show success message or toast
          toast.success("Added to Wishlist!");
        } else {
          toast.error("Product is already in Wishlist!\n");
        }
      }
    }
  };


  useEffect(() => {
    getAllProducts()
  }, [])

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('')

  const location = useLocation();

  useEffect(() => {
    const parsedFilters = queryString.parse(location.search);
    const { category = [], brand = [], minPrice = 0, maxPrice = 300000 } = parsedFilters;

    setCategories(Array.isArray(category) ? category : [category]);
    setBrands(Array.isArray(brand) ? brand : [brand]);
    setPriceRange([Number(minPrice), Number(maxPrice)]);
  }, [location.search]);

  useEffect(() => {
    const filtered = productsList.filter(product => {
      if (categories.length && !categories.includes('All') && !categories.includes(product.category)) {
        return false;
      }
      if (brands.length && !brands.includes('All') && !brands.includes(product.brand)) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });
    setFilteredProducts(filtered);
  }, [categories, brands, priceRange, productsList]);

  const getFilteredProducts = async (filterObj) => {
    let res;
    if (filterObj != null) {
      setPage(1);
      if (currentUser.userType === "admin") {
        res = await axiosWithToken.post(`http://localhost:5500/admin-api/product-filter`, filterObj)
      } else {
        res = await axiosWithToken.post(`http://localhost:5500/user-api/product-filter`, filterObj)
      }
      if (res.data.message === 'filtered products') {
        setProductsList(res.data.payload)
      } else {
        setErr(res.data.message)
      }
    } else {
      setPage(1);
      getAllProducts();
    }
  }

  const handleFilterChange = (type, value) => {
    const currentFilters = { categories, brands, priceRange };
    if (type === 'category') {
      const newCategories = categories.includes(value)
        ? categories.filter(c => c !== value)
        : [...categories, value];
      currentFilters.categories = newCategories.length ? newCategories : [''];
    } else if (type === 'brand') {
      const newBrands = brands.includes(value)
        ? brands.filter(b => b !== value)
        : [...brands, value];
      currentFilters.brands = newBrands.length ? newBrands : [''];
    } else if (type === 'price') {
      currentFilters.priceRange = value;
    }

    const query = queryString.stringify({
      category: currentFilters.categories,
      brand: currentFilters.brands,
      minPrice: currentFilters.priceRange[0],
      maxPrice: currentFilters.priceRange[1]
    });
    navigate(`?${query}`);
    const filters = {
      categories: currentFilters.categories,
      brands: currentFilters.brands,
      minPrice: currentFilters.priceRange[0],
      maxPrice: currentFilters.priceRange[1]
    };

    getFilteredProducts(filters);
  };

  const clearFilters = () => {
    setCategories([]);
    setBrands([]);
    setPriceRange([0, 30000]);
    navigate(`?`);
    getFilteredProducts({ categories: [], brands: [], minPrice: 0, maxPrice: 30000 });
  };

  const getProductDetails = (productObj) => {
    navigate(`../product`, { state: productObj });
  }

  const addCart = async (productid) => {
    if (!loginStatus) {
      navigate('/signin');
    }
    else {
      let cartObj = {
        userName: currentUser.userName,
        productId: productid
      }
      if (currentUser.userType === 'user') {
        const res = await axiosWithToken.post(`http://localhost:5500/user-api/cart`, {
          obj: cartObj,
          productId: cartObj.productId,
          user: {
            name: currentUser.userName,
            email: currentUser.email
          }
        })
        if (res.data.message === 'product added') {
          // console.log("added")
          toast.success("Added to Cart!");
        } else {
          setErr(res.data.message)
          toast.error("Product is already in Cart!\n");
        }
      }
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      getAllProducts();  // Reset to all products
      return;
    }
    try {
      const res = await axiosWithToken.get(`http://localhost:5500/products/search?query=${query}`);
      if (res.data.message === 'search success') {
        setProductsList(res.data.payload);
      } else {
        setErr(res.data.message);
        setProductsList([]);
      }
    } catch (err) {
      setErr("Error searching products");
      setProductsList([]);
    }
  };

  useEffect(() => {
    getAllProducts()
  }, [productsList]);

  const editProduct = async (product) => {
    // Navigate to an edit form or open a modal
    navigate('../editProduct', { state: product });
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5500/admin-api/delete-product/${productId}`
      );
      console.log(response.data.message);
      getAllProducts();
      setProductsList(productsList => productsList.filter(p => p.productId !== productId))
      // Optionally refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Something went wrong while deleting the product.");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);
  return (
    <div>
      <div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
      <div className="products-container d-flex" style={{ marginTop: '2%', gap: '20px' }}>
        <button className="filters-toggle-btn btn btn-primary" onClick={() => setShowFilters(true)}>
          Show Filters
        </button>

        {/* Sticky Filters */}
        {showFilters && (
        <div className="filters-popup">
          <div className="filters-content" ref={popupRef}>

            <span className="close-btn" onClick={() => setShowFilters(false)}>&times;</span>
            <div className='filters-category'>
              <h5>Categories</h5>
              {['All', 'Mobile', 'TV', 'IPAD', 'Laptop', 'Watch', 'Accessories'].map(category => (
                <label key={category}>
                  <input
                    type="checkbox"
                    value={category}
                    checked={categories.includes(category)}
                    onChange={() => handleFilterChange('category', category)}
                  />
                  {category}
                </label>
              ))}
            </div>
            <div className='filters-brand'>
              <h5>Brands</h5>
              {['All', 'samsung', 'iphone', 'redmi', 'boat'].map(brand => (
                <label key={brand}>
                  <input
                    type="checkbox"
                    value={brand}
                    checked={brands.includes(brand)}
                    onChange={() => handleFilterChange('brand', brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>
            <div className='filters-price'>
              <h5>Price Range</h5>
              <Slider
                range
                min={0}
                max={30000}
                value={priceRange}
                onChange={value => handleFilterChange('price', value)}
              />
              <div>
                <span>Min: ₹{priceRange[0]}</span> | <span>Max: ₹{priceRange[1]}</span>
              </div>
            </div>
            <button className='btn btn-danger mt-2' onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      )}

        {/* Product Display */}
        <div className='products-list d-flex flex-column' style={{ flexGrow: 1 }}>
          <div className="search-bar-container" style={{ margin: '20px 40px', width: '90%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          {productsList.length === 0 ? (
            <p className='text-center'>No products found</p>
          ) : (
            <div className='container-display d-flex flex-column' style={{ gap: "10px" }}>
              {productsList.slice(page * 10 - 10, page * 10).map((product) => (
                <div className="container2" key={product.productId} style={{ width: "100%", height: "85%" }}>
                  <div className="card2 d-flex flex-row align-items-center justify-content-between"
                    style={{
                      gap: "10px",
                      borderRadius: "10px",
                      border: "1px solid black",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
                      paddingRight: "15px"
                    }}>
                    <div className='d-flex flex-row' style={{ gap: "10px" }}>
                      <div className='card-side1 d-flex align-items-center justify-content-center'>
                        <img
                          src={`${product.imageUrls[0]}`}
                          style={{ height: "200px", width: "250px", objectFit: "contain" }}
                          onClick={() => getProductDetails(product)}
                        />
                      </div>

                      <div className="card-side2 d-flex flex-column align-items-start justify-content-center">
                        <p
                          onClick={() => getProductDetails(product)}
                          style={{ margin: "0px", fontWeight: "500", textAlign: "left", fontSize: "1.2rem" }}
                        >
                          {product.name}
                        </p>

                        <div>
                          <Stack spacing={1}>
                            <Rating
                              name="half-rating-read"
                              defaultValue={parseFloat(`${product.rating}`)}
                              precision={0.5}
                              readOnly
                            />
                          </Stack>
                        </div>

                        <div>
                          <div className='card-price'>
                            <span
                              style={{ fontSize: "28px", fontWeight: "600" }}
                              onClick={() => getProductDetails(product)}
                            >
                              ₹ {Math.floor((product.price - (product.price * (product.discount / 100))) || 0)}
                            </span>
                          </div>
                        </div>

                        <div className='card-mrp' onClick={() => getProductDetails(product)}>
                          <p>
                            MRP: <span style={{ textDecoration: "line-through" }}>₹ {product.price}</span>
                          </p>
                        </div>

                        <div className='d-flex' style={{ gap: "10px" }}>
                          <button className='btn btn-warning' onClick={() => addCart(product.productId)}>Add to Cart</button>
                          <button className='btn btn-outline-danger' onClick={() => addToWishlist(product.productId)}>Wishlist</button>
                        </div>
                      </div>
                    </div>

                    {/* Right side edit and delete icons */}
                    {loginStatus && currentUser.userType === 'admin' && (
                      <div className="d-flex flex-column align-items-end" style={{ gap: "10px" }}>
                        <FaEdit
                          size={20}
                          color="green"
                          style={{ cursor: "pointer" }}
                          onClick={() => editProduct(product)}
                        />
                        <FaTrash
                          size={20}
                          color="red"
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteProduct(product.productId)}
                        />
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

          )}
          {productsList.length !== 0 && (
            <div className='pagination-btn'>
              {page === 1 ? (
                <>
                  <button className='btn' disabled>Page 1</button>
                  <button className='btn' disabled>Previous</button>
                </>
              ) : (
                <>
                  <button className='btn' onClick={() => setPage(1)}> Page 1 </button>
                  <button className='btn' onClick={() => setPage(page - 1)}>Previous</button>
                </>
              )}
              <p style={{ margin: "0px" }}>Page {`${page}`} of {`${Math.ceil(productsList.length / 10)}`}</p>
              {page >= Math.ceil(productsList.length / 10) ? (
                <button className='btn' disabled>Next</button>
              ) : (
                <button className='btn' onClick={() => setPage(page + 1)}>Next</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products;