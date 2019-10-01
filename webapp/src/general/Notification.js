import React, { Component } from "react"
import { connect } from "react-redux"
import "./Notification.css"

class Notification extends Component {
    render() {
        console.log('rendering notify')
        console.log('show:', this.props.show)
        if (this.props.show) {
            setTimeout(
                   this.props.hide,
                5000
            )
            console.log('timing')
        }
        return (
            <div className="notification" style={this.props.show ? {top: '20px'} :{top: '-1000px'}}>
                {this.props.content}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        show: state.notify.show,
        content: state.notify.content
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        hide: () => {
            dispatch({
                type: 'HIDE_NOTIFY'
            })
        }
    }
}

export default Notification = connect(mapStateToProps, mapDispatchToProps)(Notification)