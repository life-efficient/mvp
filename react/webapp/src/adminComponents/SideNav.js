import React, { Component } from "react"
import { Link } from "react-router-dom"
import { Auth } from "aws-amplify"
import "./SideNav.css"
import { connect } from "react-redux"

class SideNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: false
        }
        console.log('LOGGED IN:', this.props.logged_in)
        console.log('logout fn:', this.props.onClickLogout)
        console.log('open:', this.props.open)
    }
    logout = () => {
        Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }

    clickLogout = () => {
        this.props.toggleMenu()
        this.props.onClickLogout()
    }

    getOptions = () => {
        if (this.props.logged_in) {
            return (
                <React.Fragment>
                    <Link to="/" onClick={this.clickLogout}>Log out</Link>
                    <Link to="/app/help" onClick={this.props.toggleMenu}>Help</Link>
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    <Link to="/" onClick={this.props.toggleMenu}>Home</Link>
                    <Link to="/SignUp" onClick={this.props.toggleMenu}>Get started</Link>
                    <Link to="/login" onClick={this.props.toggleMenu}>Sign In</Link>
                    <Link to="/help" onClick={this.props.toggleMenu}>Help</Link>
                </React.Fragment>
            )
        }
    }


    // FOR CLOSING ON OUTSIDE CLICK
    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }
    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            if (this.props.open) {
                this.props.toggleMenu()
            }
        }
    }

    getStyle = () => {
        //var bkgd = this.props.open ? {display: "relative"} : {display: "none"}
        var width = this.props.open ?  "600px" : "0px"
        var style = {
            width: width
        }
        return style
    }

    render() {
        return (
            <div id="mySidenav" className="sidenav" style={this.getStyle()} ref={this.setWrapperRef}>
                <div className="closebtn" onClick={this.props.toggleMenu}>&times;</div>
                {this.getOptions()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return  {
        logged_in: state.user.logged_in,
        open: state.sideNav.open
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClickLogout: () => {
            console.log('logging out')
            Auth.signOut()
            .then(
                () => {
                    console.log('dispatching')
                    dispatch({
                        type: "LOG_OUT"
                    })
                }
            )
        },
        toggleMenu: () => {
            dispatch({
                type: "TOGGLE_SIDENAV"
            })
        }
    }
}

export default SideNav = connect(mapStateToProps, mapDispatchToProps)(SideNav)