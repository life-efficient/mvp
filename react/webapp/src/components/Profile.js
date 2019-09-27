import React, { Component } from "react"
//import { Route, Link } from "react-router-dom"
import "./store.css"
import Section from "./Section"
import Navbar from "./Navbar"

export default class Profile extends Component {
    componentDidMount = () => {
        window.analytics.page('profile')
    }

    render() {
        var sections = [
            {
                to: "/app/profile/brands",
                title: "Brands you love"
            },
            {
                to: "/app/profile/style",
                title: "My style and preferences",
                caption: "Love vintage? Hate velvet?" 
            },
            {
                to: "/app/profile/new_request",
                title: "What are you looking for?",
                caption: 'Wanna find something specific'
            },
        ].map(
            (s, idx) => {
                return <Section to={s.to} title={s.title} caption={s.caption} idx={idx} />
            }
        )
        return (
            <>
            <Navbar />
            <div className="body" style={{backgroundColor: '#c6e0f5'}}>
                <div className="panel-title">Your profile</div>
                <div className="panel-caption">Fill in any details about your style so I can find you exactly what you're after</div>
                {sections}
                <div className="medium" style={{fontSize: '20px', margin: '20px', marginTop: '100px'}}>
                    <strong>
                        Where's my recommendations?
                        <br/>
                        <div className="small">
                            Keep an eye on your instagram DM requests.
                            <br/>
                            I'll chat to you and send you recommendations over instagram. 
                        </div>
                        ➡️📱
                        <br/> 
                        {/* <div className="small">
                            @adla.site
                        </div> */}
                    </strong>
                </div>
            </div>
            </>
        )
    }
}