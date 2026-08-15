import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

import LoginLeft from "./components/LoginLeft";
import LoginRight from "./components/LoginRight";

import "./Login.css";

const Login = () => {

  const navigate = useNavigate();

  const [selectedRole,setSelectedRole]=useState("candidate");

  const [formData,setFormData]=useState({

    email:"",
    password:""

  });

  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    try{

      const data=await loginUser(formData);

      if(

        selectedRole==="admin" &&

        data.user.role!=="admin"

      ){

        alert("This account is not registered as Administrator.");

        return;

      }

      if(

        selectedRole==="candidate" &&

        data.user.role!=="candidate"

      ){

        alert("This account is not registered as Candidate.");

        return;

      }

      localStorage.setItem("token",data.token);

      localStorage.setItem(

        "user",

        JSON.stringify(data.user)

      );

      navigate(

        data.user.role==="admin"

        ?"/admin/dashboard"

        :"/candidate/dashboard"

      );

    }

    catch(err){

      alert(

        err.response?.data?.message ||

        "Login Failed"

      );

    }

  };

  return(

    <div className="auth-page">

      <div className="auth-container">

        <LoginLeft />

        <LoginRight

          selectedRole={selectedRole}

          setSelectedRole={setSelectedRole}

          formData={formData}

          handleChange={handleChange}

          handleSubmit={handleSubmit}

        />

      </div>

    </div>

  );

};

export default Login;