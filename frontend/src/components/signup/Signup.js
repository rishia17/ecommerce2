
// import { useForm } from "react-hook-form";
// import {useState} from 'react'
// import axios from 'axios'
// import {useNavigate} from 'react-router-dom'

// function SignUp() {
//     let [err,setErr]=useState('')
//     let { register, handleSubmit} = useForm();
//     let navigate=useNavigate()
//     //handle form submit
//     async function onSignUpFormSubmit(userObj) {
//         let res;
//         userObj = { ...userObj, userType: 'user', cart: [] };
//         console.log(userObj)
//     if(userObj.userType==='user'){
//     res=await axios.post('http://localhost:5500/user-api/user',userObj)
//     }
//     if(userObj.userType==='admin'){
//       res=await axios.post('http://localhost:5500/admin-api/user',userObj)
//       }
//     if (res.data.message==='user created' || res.data.message==='admin created'){
//       //navigate to signin
//       navigate("/Signin")
//     }else{
//       setErr(res.data.message)
//     }
//     }
//     const navigateToSignIn = () => {
//     navigate('/signin');
//     };

//   return (
//     <div className="container">
//       <div className="row justify-content-center mt-5">
//         <div className="col-lg-4 col-md-6 col-sm-6">
//           <div className="card shadow form1">
//             <div className="card-title text-center border-bottom">
//               <h2 className="p-3">Signup</h2>
//             </div>
//             <div className="card-body">
//               {/* user register error message */}
//               {err.length!=0 &&<p className="text-center text-dark">{err}</p>}
//               <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
//                      {/* radio */}
//                 <div className="mb-4">
//                   <label htmlFor="userName" className="form-label">
//                     UserName
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="userName"
//                     {...register("userName")}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     {...register("password")}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label htmlFor="email" className="form-label">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     {...register("email")}
//                   />
//                 </div>
              
         
//                   <button
//                     type="submit"
//                     className="btn"
//                     style={{ backgroundColor:"#eb5757" }}
//                   >
//                     Register
//                   </button>
     
//                 <p>
//                     Already have an account?{' '}
//                     <button onClick={navigateToSignIn} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
//                     Sign in
//                     </button>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//   )
// }

// export default SignUp

import { useForm } from "react-hook-form";
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    let [err, setErr] = useState('')
    let { register, handleSubmit } = useForm();
    let navigate = useNavigate()

    // Handle form submit
    async function onSignUpFormSubmit(userObj) {
        let res;
        console.log(userObj)
        userObj = { ...userObj, cart: [] };
        console.log(userObj)
        
        if (userObj.userType === 'user') {
            res = await axios.post('http://localhost:5500/user-api/user', userObj)
        }
        if (userObj.userType === 'admin') {
            res = await axios.post('http://localhost:5500/admin-api/user', userObj)
        }
        
        if (res.data.message === 'user created' || res.data.message === 'admin created') {
            // Navigate to signin
            console.log(res)
            navigate("/Signin")
        } else {
            setErr(res.data.message)
        }
    }

    const navigateToSignIn = () => {
        navigate('/signin');
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-lg-4 col-md-6 col-sm-6">
                    <div className="card shadow form1">
                        <div className="card-title text-center border-bottom">
                            <h2 className="p-3">Signup</h2>
                        </div>
                        <div className="card-body">
                            {/* user register error message */}
                            {err.length !== 0 && <p className="text-center text-dark">{err}</p>}
                            <form onSubmit={handleSubmit(onSignUpFormSubmit)}>
                                {/* User Type Selection - Using Radio Buttons */}
                                <div className="mb-4">
                                    <label className="form-label">User Type</label><br />
                                    <label>
                                        <input type="radio" value="admin" {...register("userType")} /> Admin
                                    </label>
                                    <label className="ms-4">
                                        <input type="radio" value="user" {...register("userType")} /> User
                                    </label>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="userName" className="form-label">
                                        UserName
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
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        {...register("email")}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn"
                                    style={{ backgroundColor: "#eb5757" }}
                                >
                                    Register
                                </button>

                                <p>
                                    Already have an account?{' '}
                                    <button onClick={navigateToSignIn} style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        Sign in
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
