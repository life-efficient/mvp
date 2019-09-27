import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "../components/Navbar.css";
import menu_icon from "../images/menu-logo.png"
import logo from "../images/logo.png"
import { connect } from "react-redux"
import backArrow from "../images/icons/back-arrow.png"
import { withRouter } from "react-router-dom"

class Navbar extends Component {
    constructor(props) {
      super(props)
    }

    getLink = () => {
        console.log(this.props.back_to)
        var link
        if (this.props.logged_in) {
            link = "../"
        }
        else {
            link = "/"
        }
        console.log(link)
        return link
    }

    render() {
        switch (this.props.back) {
            case true:
                return (
                    <div className="navbar" >
                        <img src={backArrow} alt="" className="back-arrow" onClick={() => {this.props.back_to ? this.props.history.push(this.props.back_to) : this.props.history.goBack()}}/>
                        <Link to={this.getLink()} className="navbar-logo-link" >
                            <img src={logo} className="navbar-logo" alt="" />
                        </Link>
                    </div>
                )
            default:
                return (
                    <div className="navbar" >
                        <div className="navbar-menu-btn" onClick={this.props.toggleMenu}>Menu</div>
                        <Link to={this.getLink()} className="navbar-logo-link" >
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
/*
import React, { Component } from 'react'
import { Link } from "react-router-dom"
import "../components/Navbar.css";
import menu_icon from "../images/menu-logo.png"
import logo from "../images/logo.png"
import { connect } from "react-redux"

class Navbar extends Component {
    constructor(props) {
      super(props)
    }
    render() {
      const { store } = this.context
      return (
          <div className="navbar" >
              <div className="navbar-menu-btn" onClick={this.props.toggleMenu}>Menu</div>
              <Link to={this.props.logged_in ? "/5015db37-0d03-4f44-93a5-606ac215935b/admin/" : "/"} className="navbar-logo-link" >
                  <img src={logo} className="navbar-logo" alt="" />
              </Link>
          </div>
    ) 
  }
}

const mapStateToProps = (state) => {
    return {
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

export default Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar);
*/