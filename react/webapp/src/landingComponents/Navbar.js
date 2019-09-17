import React from "react"
import { Link } from "react-router-dom"
import logo from "../images/logo.png"
import { connect } from "react-redux"
import "./Navbar.css"

var Navbar = () => {
    return (
        <div className="landing-navbar" >
            <Link to={"/"} className="navbar-logo-link" style={{float: "left"}}>
                <img src={logo} className="navbar-logo" alt="" />
                
            </Link>
            
            <div className="landing-nav-right" style={{color: 'black'}}>
                <Link to="/login" >Login</Link>
                {/* <Link to="/help" >Help</Link> */}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

export default Navbar = connect(mapStateToProps)(Navbar)