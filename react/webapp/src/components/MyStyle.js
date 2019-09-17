import React, { Component } from "react"
import Style from "./Style"
import { connect } from "react-redux"
import Navbar from "./Navbar"
import { makePostRequest } from "../api_calls"

class MyStyle extends Component {
    render() {
        return (
            <>
                <Navbar back={true} />
                <div className="body" style={{backgroundColor: 'var(--orange)'}}>
                    <Style 
                    styles={this.props.user.styles ? this.props.user.styles : []}
                    onChange={(styles) => {
                        this.props.setUserInfo({styles});
                        makePostRequest('update-my-details', {styles}, 
                            () => {console.log('dets updated')}
                        )
                    }}
                    />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (update) => {
            dispatch({
                type: "SET_USER",
                update: update
            })
        }
    }
}

export default MyStyle = connect(mapStateToProps, mapDispatchToProps)(MyStyle)
