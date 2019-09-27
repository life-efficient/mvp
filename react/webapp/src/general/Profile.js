import React, { Component } from "react"
import Navbar from "./Navbar"
import Style from "../components/Style"
import "./Profile.css"
import uuid from "uuid"
import { connect } from "react-redux"
import default_dp from "../images/misc/default-profile.png"
import { makePostRequest } from "../api_calls"
import { Storage } from "aws-amplify"
import StylistStats from "./StylistStats"
import FeatureRequest from "./FeatureRequest"
import Bio from "./Bio"

class Profile extends Component {

    uploadDP = (e) => {
        console.log('uploading')
        return new Promise(
            (resolve, reject) => {
                var type
                var url
                var fp
        var file = e.target.files[0]
                type = file.type.split('/')[1]
                fp = `recommended_items/${uuid.v4()}.${type}`
                var mimeType 
                if (type == 'png') {
                    mimeType = 'image/png'
                }
                else if (type == 'jpg' || type == 'jpeg') {
                    mimeType = 'image/jpeg'
                }
                else {
                    alert('image type invalid (use .PNG, .JPG or .JPEG images)\nYou used type ' + type)
                    return null
                }
                console.log('puttin')
                Storage.put(fp, file, {contentType: mimeType})
                .then(
                    () => {
                        url =`https://s3-eu-west-1.amazonaws.com/adla-data/public/${fp}`
                        this.props.setStylistInfo({display_pic: url})
                    }
                )
                .catch((err) => {alert('ERROR:', err)})
                //.catch(reject(Error('The following file failed to upload:', files[i])))
                }
        )
    }

    render() {
        // console.log('USER:', this.props.user)
        console.log('profile styles:', this.props.user)
        return (
            <>
            <Navbar back={true} />
            <div className="body" style={{backgroundColor: '#89C497'}}>
                <div className="large">
                    My profile
                </div>
                <div className="dp-container">
                    <label for="dp-input" className="dp-input">
                        <input onChange={this.uploadDP} id="dp-input" type="file" style={{display: 'none'}} />
                        <img src={this.props.dp_url ? this.props.dp_url : default_dp} className="display-pic" alt=""/>
                    </label>
                </div>
                <Bio bio={this.props.user.bio}/>
                <StylistStats user={this.props.user}/>
                <Style styles={this.props.user}
                //  endpoint='stylist-my-info'
                onChange={(styles) => {
                    this.props.setStylistInfo({styles});
                    makePostRequest('stylist-my-info', {styles}, 
                        () => {console.log('dets updated')}
                    )
                }}
                 />
                <FeatureRequest />
            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    // console.log(state.user)
    return {
        dp_url: state.user.display_pic,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setStylistInfo: (update) => {
            makePostRequest('stylist-my-info', update,
                () => {
                    console.log('user updated')
                }
            )
            dispatch({
                type: "SET_USER",
                update: update
            })
        }
    }
}

export default Profile = connect(mapStateToProps, mapDispatchToProps)(Profile)