import React, { Component } from "react"
import Navbar from "./Navbar"
import Section from "../general/Section"
import "./store.css"

export default class Home extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount = () => {
        window.analytics.page('home')
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
                <Navbar />
                <div className="panel-title">Home</div>
                {sections}
            </>
        )
    }
}