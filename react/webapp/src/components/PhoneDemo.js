import React, { Component } from "react"

export default class PhoneDemo extends Component {
    render() {
        return (
            <div id="phone-demo" className="showcase-image">
                <video autoPlay loop muted playsInline>
                    <source src="videos/video-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }
}
