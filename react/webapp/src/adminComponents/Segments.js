import React from "react"
import Section from "../components/Section"
import "./Segments.css"

const Segment = (props) => {
    return (
        <div className="segment">
            <div className="medium">
                {props.segmentName}
            </div>
            <div className="large">+</div>
        </div>
    )
}

const Segments = () => {
    return (
        <div className="body">
            <div className="medium">
                User segments
            </div>
            <Segment segmentName={'yo'}/>
        </div>
    )
}

export default Segments