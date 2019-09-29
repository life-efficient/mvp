import React from "react"
import { Link } from "react-router-dom"
import logo from "../images/name.png"
import "./Navbar.css"
import "./Footer.css"

const Footer = () => {
    return (
        <div className="landing-footer small" >
            <div>
                <div className="one">contact:</div>
                <div className="two">ice@stint.co</div>
                <div className="three">+447765892392</div>
            </div>
            {/* <div style={{textAlign: 'right'}}>
                <div>777 Hamilton Ave</div>
                <div>Menlo Park, CA</div>
                <div>CA</div>
            </div> */}
        </div>
    )
}

export default Footer