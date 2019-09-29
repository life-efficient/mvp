import React from "react"
import { Link } from "react-router-dom"
import logo from "../images/name.png"
import "./Navbar.css"
import "./Footer.css"

const Footer = () => {
    return (
        <div className="landing-footer small" >
            <div>
                <div className="two">youname@email.com</div>
                <div className="three">01234567890</div>
            </div>
        </div>
    )
}

export default Footer