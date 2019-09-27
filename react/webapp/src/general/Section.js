import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./Section.css"
import arrow from "../images/icons/arrow.png"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

class Section extends Component {

    render() {
        return (
            <Link to={{
                pathname: this.props.to,
                search: this.props.search,
                state: this.props.passthrough
            }}
                className="section"
                style={this.props.idx ? {animationDelay: `0.${this.props.idx}s`} : null}
                >
                <div>
                    <div className="section-title">{this.props.title}</div>
                    <div className="section-caption">{this.props.caption}</div>
                </div>
                <img src={arrow} alt=""/>
            </Link>
        )
    }
}

export default Section = withRouter((Section))