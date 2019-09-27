import React, { Component } from "react"
//import { Route, Link } from "react-router-dom"
import "./store.css"
import Section from "../general/Section"

export default class Profile extends Component {
    componentDidMount = () => {
        window.analytics.page('profile')
    }

    render() {
        var sections = [
            {
                to: "/app/profile/analytics",
                title: "Analytics"
            },
            {
                to: "/app/enter_ig",
                title: "Users enter instagram"
            },
            {
                to: "/app/give_code",
                title: "Give code"
            }
        ].map(
            (s, idx) => {
                return <Section to={s.to} title={s.title} caption={s.caption} idx={idx} />
            }
        )
        return (
            <>
            {/* <Navbar /> */}
            {/* <div className="body" style={{backgroundColor: '#c6e0f5'}}> */}
                <div className="panel-title">Your profile</div>
                {sections}
                
            {/* </div> */}
            </>
        )
    }
}