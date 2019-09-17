import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./Index.css"
import Button from "./Button"
import { connect } from "react-redux"
import ProductMarquee from "./ProductMarquee"
import { Analytics } from "aws-amplify";
import Footer from "../landingComponents/Footer"
import TestimonialMarquee from "./TestimonialMarquee"
import chat from "../images/icons/chat.svg"
import top from "../images/icons/top.png"
import delivery from "../images/icons/delivery.png"
import Signup from "./Signup"
import LandingNavbar from "../landingComponents/Navbar"
import fire from "../images/misc/fire.gif"
import snoop from "../images/misc/snoop.gif"
import cash from "../images/misc/cash.gif"


const useScroll = () => {
    const ref = React.useRef(null)
    const executeScroll = () => {
        window.scrollTo(0, ref.current.offsetTop)
    }
    const htmlElementAttributes= {ref}

    return [executeScroll, htmlElementAttributes]
}

// class Home extends Component {
    // constructor(props){
    //     super(props)
    //     this.state = {animate: ''}
    // }

    // componentDidMount = () => {
    //     console.log(window.location.host)
    //     if (!(window.location.host == 'localhost:3000')) {
    //         console.log('trac')
    //         window.analytics.page('landing')
    //     }
    //     this.scroll = Scroll.animateScroll;
    // }

    // componentWillUnmount = () => {
    //     this.setState({animate: 'roll-out'})
    // }

    // render() {
var Home = (props) => {
    // const [executeScroll, scrollHtmlAttributes] = useScroll()
        return (
            <>
            <LandingNavbar />
            <Signup />
            <div className="index-section" style={{paddingTop: '100px', paddingBottom: '100px', backgroundColor: '#C6E0F5'}}>
                {/* <img src={cash} style={{}} style={{position: 'absolute', height: '200px', left: '0px', top: '-20px'}} /> */}
                {/* <ProductMarquee /> */}
                <div className="large">
                    Try on clothes at home for free
                </div>
                <div className="small">
                    Pay for what you love and we'll pick up the rest!
                </div>
                <div>
                    Even try multiple sizes to make sure you get that perfect fit.
                </div>
                {/* <ProductMarquee gender='male' dir="toRight"/> */}
                <img src={fire} style={{position: 'absolute', height: '200px', right: '0px', bottom: '0px'}}/>
            </div>
            {/*
            <div className="index-section medium">
                Adla's recommendations get better as she gets to know your style
            </div>
            */}
            <div className="index-section" style={{overflow: 'hidden', backgroundColor: '#89C497'}}>
                <div className="large">
                    From the users
                </div>
                <TestimonialMarquee />
            </div>

            <div className="index-section" style={{backgroundColor: '#EA653C'}}>
                <div className="large" id="second-title">
                    How Adla works
                </div>

                <div id="how-it-works">
                    <div className="how-it-works-step">
                        {/*<img src={chat} className="icon" />*/}
                        <div className="medium">
                            1. Chat to Adla over instagram dm or text
                            <div className="small">
                                Fill Adla in on your unique style and what you’re hunting for and she’ll scour 1000s of the coolest online clothing brands to find personalised picks for you. 
                                <br/>
                                Meanwhile, you can chill with a flat white (or any other drink of your choice – Adla doesn’t dictate)
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div className="how-it-works-step">
                        {/*<img src={top} className="icon" />*/}
                        <div className="medium">
                            2. Get sent recommendations
                            <div className="small">
                                Adla will DM you the gems she's found. 
                                <br/>
                                Tell her which ones you want to try on, and which are rejects. After all, no one knows what suits you better than you. No, not even Adla.
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div className="how-it-works-step">
                        {/*<img src={top} className="icon" />*/}
                        <div className="medium">
                            3. Try them on at home for free 
                            <div className="small">
                                Adla will deliver to you – wherever you are in London or the Bay Area, whenever suits, for free.
                                <br/> 
                                Adla send you multiple sizes. Try them on in your own time
                                <br/>
                                <br/>
                            </div>
                        </div>
                    </div>
                    <div className="how-it-works-step">
                        {/*<img src={delivery} className="icon" />*/}
                        <div className="medium">
                            4. Adla picks up anything you don’t want. 
                            <div className="small">
                                    Love them? Keep them and pay up online. 
                                <br/>
                                    Not vibing them? Drop Adla a dm and she’ll pick them back up, no charge.
                                <br/>
                                Literally pay $0 if you don't keep anything.
                                <br/>
                            </div>
                        </div>
                    </div>
                    {/* <div onClick={executeScroll} className="main_button btn first-btn"> */}
                    {/* <div className="main_button btn first-btn">
                        Let's do this!
                        <div className="shine-container"><div className="shine"></div></div>
                    </div> */}
                <img src={snoop} style={{maxHeight: '100px', maxWidth: '100px', float: 'right'}}/>
                </div>
            </div>
            <Footer />
           </>
        )
    }


const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

export default Home = connect(mapStateToProps)(Home)