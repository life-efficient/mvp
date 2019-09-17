import React, { Component } from "react"
import Section from "./Section"
import { Route, Link } from "react-router-dom"
import "./store.css"
import Styleboards from "./Styleboards";
import Requests from "./Requests";
import Request from "./Request";

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
                {/*
                <Section to="challenges" title="Style quizzes" caption="Earn rewards and let Adla know about your style" />
                */}
                <Section to="/app/home/styleboards" title="Styleboards" caption="Moodboards for you"/>
                
                <Route path={'/app/home/styleboards'} exact component={Styleboards} />
            </div>
        )
    }
}