import React from 'react'
import { useForm } from 'react-hook-form';
import { userLoginThunk } from "../../redux/slices/userLoginSlice";
import {useDispatch, useSelector} from 'react-redux';
import { useState } from 'react';
import {NavLink, useNavigate} from 'react-router-dom'
import { useEffect } from 'react';
function Signin() {

  let { register, handleSubmit,formState:{errors} ,} = useForm();

  let dispatch=useDispatch()
  let navigate=useNavigate()
  const {isPending,currentUser,errorStatus,errorMessage,loginStatus}=useSelector(state=>state.userLogin)
  //handle form submit
  function handleFormSubmit(userCred) {
    const userCredentialsWithType = {
      ...userCred,
      userType: 'user'
    };
    let actionObj = userLoginThunk(userCredentialsWithType);
    dispatch(actionObj);
  }
  
useEffect(()=>{
  if (loginStatus){
    if (currentUser.userType==='user'){
      navigate('/')
    }
    if (currentUser.userType==='admin'){
      navigate("/")
    }
  }
},[loginStatus]);

  return (
    <div className="container">
    <div className="row justify-content-center mt-5">
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="card shadow form1">
          <div className="card-title text-center border-bottom ">
            <h2 className="p-3">Signin</h2>
          </div>
          <div className="card-body ">
            {/* invalid cred err */} 
              {errorStatus=== true && (
              <p className="text-center error-msg" style={{ color: "var(--crimson)" }}>
                {errorMessage}
              </p>
            )} 
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="mb-4">
                <label htmlFor="userName" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  
                  {...register("userName")}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
  
                  {...register("password")}
                />
              </div>
          
                <button type="submit" className="btn "   style={{ backgroundColor:"#eb5757" }}>
                  Login
                </button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Signin