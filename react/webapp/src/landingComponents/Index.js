import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./Index.css"
import Button from "../general/Button"
import { connect } from "react-redux"
// import { Analytics } from "aws-amplify";
import Navbar from "./Navbar"
import Tabs from "../general/Tabs";
import realhero from "../images/githero.jpg"

class Home extends Component{
    

    render() {
        return (
            <div>
                <img src={realhero} className="hero-image" alt="" />   
                <h1 className = "hero-text">GOURMET</h1>       
            </div> 
        )
    }
}


const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

export default Home = connect(mapStateToProps)(Home)