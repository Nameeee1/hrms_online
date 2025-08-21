import React from "react";
import logoImg from "../img/hr-logo.png";
import "../index.css";

const Logo = () => {
    return (
        <div className="logo">
            <div className="logo-icon">
                <img src={logoImg} alt="HRMS Logo" />
            </div>
        </div>
    );
};

export default Logo;
