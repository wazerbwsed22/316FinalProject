
import React from "react";
import { Link } from "react-router-dom";


const WelcomePage = () => {
  return (
    <div
      style={{
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
      }}>
    
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderRadius: "10px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          boxShadow: "none",
        }}>
      
        <h1
          style={{
            color: "white",
            fontSize: "4.375rem", 
            textAlign: "center",
            fontWeight: "bold",
          }}>
        
          Fake Stack Overflow
        </h1>
        <StyledLink to="/login" label="Login" />
        <StyledLink to="/register" label="Register" />
        <StyledLink to="/mainstackoverflow" label="Guest" />
      </div>
    </div>
  );
};

const StyledLink = ({ to, label }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <button
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  </Link>
);

export default WelcomePage;
