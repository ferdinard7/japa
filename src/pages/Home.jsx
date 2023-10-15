import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { FaUsers } from "react-icons/fa";
import BarChart from "../components/BarCart";
import PieChart from "../components/PieChart";
import { users } from "../data";
import img from "../images/gb-profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

const Home = () => {

  const [userDetails, setUserDetails] = useState({});

  const [ cookies, setCookie, removeCookie] = useCookies(null);

  const authToken = cookies.AuthToken;
  console.log(authToken);

  // const location = useLocation();
  // const{ access_token } = location.state;

  
  // console.log(access_token);

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("http://test.sammykingx.tech/user/profile", {
          headers,
        });

        if (res.status === 200) {
          setUserDetails(res.data);
          console.log(res.data)
          console.log(userDetails);
        } else {
          console.error("Failed to fetch drafts:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    };

    getUserDetails();
  }, [headers]);

  const navigate = useNavigate();
  const logoutUser = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const cards = [
    { id: 1, icon: <FaUsers />, text: "Members", num: 55 },
    { id: 2, icon: <FaUsers />, text: "Members", num: 55 },
    { id: 3, icon: <FaUsers />, text: "Members", num: 55 },
    { id: 4, icon: <FaUsers />, text: "Members", num: 55 },
  ];
  return (
    <div className="dashboard-component">
      <div className="top">
        <div>
          <h2>Dashboard</h2>
          {/* {data.name} */}
          <span className="my-span">Welcome Back {userDetails.email}</span>
        </div>
        <div className="profile-img">
          <img src={img} alt="" />
          <div className="account">
            <Link>Account</Link>
            <span className="a" onClick={logoutUser}>
              Logout
            </span>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="cards">
          {cards.map((x) => (
            <div className="card" key={Math.random()}>
              <span className="info">
                <span>{x.text}</span>
                <FaUsers />
              </span>
              <h3>{x.num}</h3>
            </div>
          ))}
        </div>
        <div className="charts">
          <BarChart />
          <PieChart />
        </div>
        <div className="users">
          <h3>Users</h3>
          {users.map((x) => (
            <div className="user" key={Math.random()}>
              <img src={x.img} alt="" />
              <div>
                <span>{x.username}</span>
                <span>online</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
