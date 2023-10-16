import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import "../css/Auth.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  //  const [inputs, setInputs]= useState({});
  //  const [confirmPassword, setConfirmPassword] = useState('');
  // const [file, setFile] = useState(null);

  // const handleChange = (e) => {
  //  setInputs(prev=> {
  //   return {...prev, [e.target.name]: e.target.value}
  //  })
  // }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_num, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone_num: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  const [isLoading, setIsLoading] = useState(false); // Initialize loading state

  // const { name, email, phone_num, password, confirmPassword } = formData;

  // const infoData = { name, email, phone_num, password };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleRegistration = async (e) => {
    e.preventDefault();
    // if (!name || !email || !phone_num || !password || !confirmPassword) {
    //   return toast.error("PLEASE FILL ALL FIELDS");
    // }
    // if (password.length < 8) {
    //   return toast.error("PASSWORD MUST BE AT LEAST 8 CHARACTERS LONG");
    // }
    // if (password !== confirmPassword) {
    //   return toast.error("PASSWORDS DO NOT MATCH");
    // }
    // Set loading state to true while making the registration request
    setIsLoading(true);

    try {
      let role = "user"
      const response = await axios.post(
        "https://japaconsults.sammykingx.tech/user/register",
        JSON.stringify({name, email, phone_num, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }

      );

      toast.success("USER REGISTERED SUCCESSFULLY");
      console.log("User registered successfully:", response.data);
      navigate("/login");
    } catch (error) {
      // toast.error("AN ERROR OCCURRED");
      console.log("Error registering user:", error);
    } 
  };

  return (
    <div className="auth-form2">
      <form onSubmit={handleRegistration}>
        <img src={logo} alt="japa-logo" width="140px" />
        <div>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phone_num">Phone Number:</label>
          <input
            type="text"
            id="phone_num"
            name="phone_num"
            value={phone_num}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {/* Disable the button and show "REGISTERING..." text when loading */}
          <button className="login-btn2" type="submit" disabled={isLoading}>
            {isLoading ? "REGISTERING..." : "REGISTER"}
          </button>
        </div>
        <p className="a-word">Already have an account?</p>
        <section>

             <Link className="log-btn" to="/login">LOGIN</Link>
          
        </section>
      </form>
    </div>
  );
};

export default SignUp;
