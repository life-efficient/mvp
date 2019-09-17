import React, { Component } from "react"
import Navbar from "./Navbar"
import "./UserManual.css"

export default class UserManual extends Component {
    render() {
        return (
            <>
            <Navbar back={true}/>
            <div className="large manual-section" style={{backgroundColor: '#89c497'}}>
                User Manual
            </div>
            <div className="manual-content">
                <div className="manual-section" style={{backgroundColor: '#FFC8DB'}}>
                    <div className="large">
                        Why style for Adla?
                    </div>
                    <div className="small">
                        <ul>
                            <li>You can work whenever you want</li>
                            <li>You can work wherever you want</li>
                            <li>We want to make an effort to provide you with a more interesting job than you might have otherwise. More people like yourselves should have the opportunity to style.</li>
                            <li>You can earn more than you might doing other jobs</li>
                            <li>Adla is funded by <span style={{textDecoration: 'underline', color: 'black !important', cursor: 'pointer'}}><a href='https://ycombinator.com'>Y Combinator</a></span> - the most successful startup accelerator in the world, and we are more than happy to give you a reference.</li>
                        </ul>
                    </div>
                </div>
                <div className="manual-section" style={{backgroundColor: '#c6e0f5'}}>

                    <div className="large">
                        Making recommendations
                    </div>
                    <br/>
                    <div className="medium">
                        What should I make sure of when making a recommendation?
                    </div>
                    <div className="small">
                        <ul>
                        <li>Make sure the items can be shipped to the users location (London or SF)</li>
                        <li>The items are available in the user’s size </li>
                        <li>It’s all within the user’s budget.</li>
                        <li>When saving or screenshotting the photo make sure to save a high quality picture. It can’t be pixelated. No one wants to get a pixelated image.</li>
                        <li>Crop each image so that it’s obvious which item in it is the one being recommended. It’s best that people don’t have to ask “Ummm, am I going to get the shorts or the top from this image in my box???”</li>
                        </ul>
                    </div>
                    <br/>
                    <div className="medium">
                        When will a user get my recommendations?
                    </div>
                    <div className="small">
                        <li>New recommendations are being checked for at 30 minutes past the hour</li>
                        <li>A user will only get recommendations if they have at least 5 waiting</li>
                        <li>A user will currently receive at most 9 recommendations at once</li>
                        <li>A user will get a batch of recommendations once per day, unless they ask for more</li>
                    </div>
                    <br/>
                    <div className="medium">
                        Getting more info from the user
                    </div>
                    <div className="small">
                        <li>Currently we interact with all of our users through instagram, which doesn’t allow us to have you message them directly 😭</li>
                        <li>You can ask us to ask them anything at any point through @adla.stylist’s instagram page</li>
                    </div>
                    <br/>
                </div>
                <div className="medium">

                </div>
            </div>
            </>
        )
    }
}