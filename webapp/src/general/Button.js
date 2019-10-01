import React, { Component } from "react";
// import "./Button.css";

export default class Button extends Component {
    render() {
        return (
            <button onClick={() => {console.log('logging button click')}}> 
                { this.props.content}
            </button>
        )
    }
}