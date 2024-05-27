import React, { useState } from 'react';
import logo from '../component/image/reuf-white.jpg';
import axios from '../api/axios';

import { useAuthContext } from '../hooks/useAuthContext';
import { useLocation, useNavigate } from 'react-router-dom';


function SignIn() {

  const {dispatch} = useAuthContext();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const signin = () => {
    const data = {username:username, password:password}
      axios.post('/signin', data).then(async (response) => {
        const json = await response.data;
        console.log(json)
        if(json.error){
          setErr(json.error)
        }else{
          localStorage.setItem("accessToken", JSON.stringify(json));
          dispatch({type: 'LOGIN', payload: json});
          navigate(from, {replace:true})
        }
      }).catch((error) => {
        console.log(error)
      })
  }

  return (
    <div class="container">
  <div className='row justify-content-center text-center'>
    <div className='col-md-6'>
    <div className='row justify-content-center text-center mt-3'>
      </div>
      <div class="card">
        <div class="card-body">
        <h1 className='mb-3' style={{fontWeight:'bolder', color:'#444444', fontSize:'300%', opacity:'0.5'}}>SIGN IN</h1>
        {!err ?(<></>):(
                    <>
                <div class="alert alert-danger" role="alert">
                    {err}
                </div>
                    </>
                )}
        <form>
            <div class="form-floating mb-3">
            <input type="text" class="form-control" id="floatingInput" placeholder="Username" onChange={(event) => {setUsername(event.target.value)}} />
            <label for="floatingInput">Username</label>
          </div>
          <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" onChange={(event) => {setPassword(event.target.value)}} />
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-grid gap-2 my-3">
            <button class="btn btn-dark" type="button" onClick={signin}>Sign In</button>
          </div>
        </form>
        </div>
        </div>
    </div>
  </div>
</div>
  )
}

export default SignIn