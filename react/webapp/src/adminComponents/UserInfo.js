import React, { Component } from "react"
import {makeGetRequest} from "../api_calls"
import queryString from "query-string"
import "./UserInfo.css"

class UserInfo extends Component {
    constructor(props) {
        super(props)
        var loc = window.location.search
        var params = queryString.parse(loc)
        var sub = params.sub
        this.state = {
            user_id: sub,
            user: null,
            liked_images: null
        }
        // this.getUserInfo()
        // this.getUserRequests()
        //this.getLikedImages()
    }

    getLikedImages = () => {
        if (!this.props.user) return null;
        var data = this.props.user
        console.log('setting user:', this.props.user)
        var liked_images = data.swipe_responses ? 
            data.swipe_responses.filter(
                (item) => {
                    return item.response == 'yes'
                }
            )
            :
            []

        liked_images = liked_images.map(
            (item) => {
                return <img className="liked-img" src={item.img_id} alt="" />
            }
        )
        return liked_images
    }
    
    getBasicInfo = () => {
        if (!this.props.user) return null;
        var data = this.props.user
        console.log('USER INFO:', data)
        var body = []
        var keys = ['name', 'location', 'instagram', 'gender', 'acq_channel', 'price_range', 'referral', 'last_served', 'size', 'styles']
        keys = keys.filter((key) => {return Object.keys(data).includes(key)})
        console.log(keys)
        for (var key of keys) {
            var value = data[key]
            if (typeof(value) == 'string'){
                body.push(<div className="basic-info-elem">
                        <div>{key}:</div>
                        <div>{value}</div>
                    </div>
                )
            }
            if (typeof(value) == 'object'){
                if (['size'].includes(key)) {
                    body.push(<strong>{key}</strong>)
                    Object.keys(value).map(
                        (k) => {
                            var _k
                            if (k == 'heightMajor') {_k = 'Ft'}
                            else if (k == 'heightMinor') {_k = 'Inches'}
                            else if (k == 'metric') {return null}
                            else {_k = k}
                            body.push(<div className="basic-info-elem">
                                    <div>{_k}:</div>
                                    <div>{value[k]}</div>
                                </div>
                            )
                        }
                    )
                    body.push(<br/>)
                }
            }
            if (typeof(value) == 'array') {
                
            }
        }
        console.log(body)
        return body
    }

    getRequests = () => {
        if (!this.props.user) return null;
        return this.props.user.requests ?
            this.props.user.requests.map(
                (req) => {
                    return req.request
                }
            )
            :
            []
    }

    render() {
        return (
            <div className="userInfo panel">
                <div className="medium">User Info</div>
                <div className="small"><strong>Basic info</strong></div>
                <div className="basic-info">
                    {this.getBasicInfo()}
                </div>
                <div>
                    <div className="medium">
                        Latest requests
                    </div>
                    <div>
                        {this.getRequests()}
                    </div>
                </div>
                <div className="small"><strong>Liked images</strong></div>
                <div className="liked-imgs">
                    {this.getLikedImages()}
                </div>
            </div>
        )
    }
}

export default UserInfo