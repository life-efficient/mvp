import React, { Component } from "react"
import "./Index.css"
import { connect } from "react-redux"
import hero from "../images/realhero.jpg"

class Home extends Component{
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="hero-image">
                <div className="hero-text">
                    <div className="title-text">GOURMET</div>
                    <p className="bullet-text"> Have you ever had money and spent it unwisely. Have you ever not hand money and spent it unwisely. Life is full of poor choices. Make a smart one, by choosing gourmet food today. No taste buds, no problem.</p>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        logged_in: state.user.logged_in
    }
}

export default Home = connect(mapStateToProps)(Home)