import React, { Component } from "react"

export default class TextQuestion extends Component {
    render() {
        return (
            <div className="question">
                <div className="ask">
                    { this.props.q }
                </div>
                <input className="text-response" id="name" placeholder="Your name" />
            </div>
        )
    }
}