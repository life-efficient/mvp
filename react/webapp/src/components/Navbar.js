import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "./Navbar.css";
import menu_icon from "../images/menu-logo.png"
import logo from "../images/logo.png"
import { connect } from "react-redux"
import backArrow from "../images/icons/back-arrow.png"
import { withRouter } from "react-router-dom"

class Navbar extends Component {
    constructor(props) {
      super(props)
    }
    render() {
        switch (this.props.back) {
            case true:
                return (
                    <div className="navbar" >
                        <img src={backArrow} alt="" className="back-arrow" onClick={() => {this.props.history.goBack()}}/>
                        <Link to={this.props.logged_in ? "/app" : "/"} className="navbar-logo-link" >
                            <img src={logo} className="navbar-logo" alt="" />
                        </Link>
                    </div>
                )
            default:
                return (
                    <div className="navbar" >
                        <div className="navbar-menu-btn" onClick={this.props.toggleMenu}>Menu</div>
                        <Link to={this.props.logged_in ? "/app" : "/"} className="navbar-logo-link" >
                            <img src={logo} className="navbar-logo" alt="" />
                        </Link>
                    </div>
                )
        }
  }
}

const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: () => {
            dispatch({
                type: "TOGGLE_SIDENAV"
            })
        }
    }
}

export default Navbar = withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar))