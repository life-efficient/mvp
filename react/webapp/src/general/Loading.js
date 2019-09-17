import React from "react"
import "./Loading.css"

const Loading = (props) => {
    return (
        <div className="loading">
            <div className="loading-segment"></div>
            <div className="loading-inner"></div>
        </div>
    )
}

export default Loading