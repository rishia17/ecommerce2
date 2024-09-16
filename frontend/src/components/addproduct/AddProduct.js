
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
function AddProduct() {

  let { register, handleSubmit }=useForm();
  let [err,setErr]=useState("")
  let navigate=useNavigate()
  const token=sessionStorage.getItem('token')
  const axiosWithToken=axios.create({
      headers:{Authorization:`Bearer ${token}`}
  })
  let {currentUser} = useSelector(
      (state) => state.userLogin
  );
  

  const addNewProduct=async(newProduct) =>{
    console.log('addnew product working',newProduct);
    newProduct.productId=Date.now();
    newProduct.reviews=[];
    newProduct.dateOfCreation=new Date();
    newProduct.dateOfModification= new Date();
    newProduct.status=true;
    newProduct.imageUrls = newProduct.imageUrls.split('\n').map(url => url.trim());
 
    // make http post request to author api
    let res=await axiosWithToken.post('http://localhost:5500/admin-api/new-product',newProduct)
    if(res.data.message==="new product is added"){
        //navigate for articles author component
          // 
          navigate('/');
          console.log('product added')
    }else{
        setErr(res.data.message)
    }
}
    
  return (
    <div className="container">
    <div className="row justify-content-center mt-5">
      <div className="col-lg-8 col-md-8 col-sm-10">
        <div className="card shadow" >
          <div className="card-title text-center border-bottom">
            <h2 className="p-3">Add a Product</h2>
          </div>
          <div className="card-body" >
            <form onSubmit={handleSubmit(addNewProduct)}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  {...register("name")}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  {...register("description")}
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  {...register("price")}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="form-label">
                Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  {...register("quantity")}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="form-label">
                  rating
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="rating"
                  name="rating"
                  {...register("rating")}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="form-select"
                  defaultValue="All"
                  {...register("category")}
                >
                  <option value="All">All</option>
                  <option value="Mobile">Mobile</option>
                  <option value="TV">TV</option>
                  <option value="IPAD">IPAD</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Watch">Watch</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="color" className="form-label">
                  color
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="color"
                  name="color"
                  {...register("color")}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="discount" className="form-label">
                  discount
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="discount"
                  name="discount"
                  {...register("discount")}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="brand" className="form-label">
                  brand
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  name="brand"
                  {...register("brand")}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="imageUrls" className="form-label">
                  Image URLs (one per line)
                </label>
                <textarea
                  className="form-control"
                  id="imageUrls"
                  name="imageUrls"
                  rows="4"
                  {...register("imageUrls")}
                ></textarea>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AddProduct;