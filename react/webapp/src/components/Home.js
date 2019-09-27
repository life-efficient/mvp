import React, { Component } from "react"
import Section from "./Section"
import { Route, Link } from "react-router-dom"
import "./store.css"


export default class Home extends Component {
    constructor(props) {
        super(props)
        var{ path } = this.props.match
    }

    componentDidMount = () => {
        window.analytics.page('home')
    }

    render() {
        return (
            <div className="body">
                <div className="panel-title">Home</div>
                <div className="panel-caption">Track your requests or save inspiration and outfits on your styleboards</div>
                <Section to="/app/home/requests" title="My requests" caption="All the clothes you've used Adla to find" />
                               
            </div>
        )
    }
}