import React, { Component } from "react"
import { connect } from "react-redux"
import "./SlideUpPanel.css"

class SlideUpPanel extends Component {
    constructor(props) {
        super(props)
        
    }
    render () {
        console.log('slideup props:', this.props)
        console.log('slideup content:', this.props.content)
        return (
            <div className="SlideUpPanel" style={this.props.open ? {height: "100%"} : {height: "0vh"}}>
                <div className="closebtn large" onClick={this.props.close}>
                    &times;
                </div>
                <div>
                    {this.props.content}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        open: state.slideUp.open,
        content: state.slideUp.content
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => {
            dispatch({
                type: "CLOSE_SLIDEUP",
                //content: content
            })
        }
    }
}

export default SlideUpPanel = connect(mapStateToProps, mapDispatchToProps)(SlideUpPanel)