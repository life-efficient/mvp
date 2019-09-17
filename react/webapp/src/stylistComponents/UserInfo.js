import React, { Component } from "react"
import {makeGetRequest} from "../api_calls"
import queryString from "query-string"
import "../adminComponents/UserInfo.css"

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
        liked_images = <><div className="medium">Liked images</div>{liked_images}<br/></>
                
        return liked_images
    }
    
    getBasicInfo = () => {
        if (!this.props.user) return null;
        var data = this.props.user
        console.log('USER INFO:', data)
        var body = []
        var keys = ['name', 'location', 'instagram', 'gender', 'acq_channel', 'price_range', 'referral', 'last_served', 'size', 'styles', 'brands']
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
                    body.push(<div className="medium">{key}</div>)
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
            console.log('key:', key)
            console.log('typeof:', typeof(value))
            console.log(value)
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    console.log('adding array:', key)
                    body.push(<div className="medium">{key}</div>)
                    var tags = []
                    value.map(
                        (item) => {
                            tags.push(
                                <div className="tag">

                                {item}
                                </div>
                            )
                        }
                    )
                    body.push(<><div className="tags">{tags}</div><br/></>)
                }
            }
        }
        console.log(body)
        return body
    }

    getRequests = () => {
        if (!this.props.user) return null;
        return this.props.user.requests ?
            <>
            <div className="medium">Latest requests</div>
            {
                this.props.user.requests.map(
                    (req) => {
                        return req.request
                    }
                )
            }
            <br/>
            <br/>
            </>
            :
            null
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
                    <div>
                        {this.getRequests()}
                    </div>
                </div>
                <div className="liked-imgs">
                    {this.getLikedImages()}
                </div>
            </div>
        )
    }
}

export default UserInfo

// import React, { Component } from "react"
// import {makeGetRequest} from "../api_calls"
// import queryString from "query-string"
// import "../adminComponents/UserInfo.css"

// class UserInfo extends Component {
//     constructor(props) {
//         super(props)
//         var loc = window.location.search
//         var params = queryString.parse(loc)
//         var sub = params.sub
//         this.state = {
//             user_id: sub,
//             user: null,
//             liked_images: null,
//             requests: null
//         }
//         this.getBasicInfo()
//         // this.getLikedImages()
//     }

//     getBasicInfo = () => {
//         if (!this.props.user) return null;
//         var data = this.props.user
//         console.log('USER INFO:', data)
//         var body = []
//         var keys = ['name', 'location', 'instagram', 'gender', 'acq_channel', 'price_range', 'referral', 'last_served', 'size', 'styles']
//         keys = keys.filter((key) => {return Object.keys(data).includes(key)})
//         console.log(keys)
//         for (var key of keys) {
//             var value = data[key]
//             if (typeof(value) == 'string'){
//                 body.push(<div className="basic-info-elem">
//                         <div>{key}:</div>
//                         <div>{value}</div>
//                     </div>
//                 )
//             }
//             if (typeof(value) == 'object'){
//                 if (['size'].includes(key)) {
//                     body.push(<strong>{key}</strong>)
//                     Object.keys(value).map(
//                         (k) => {
//                             var _k
//                             if (k == 'heightMajor') {_k = 'Ft'}
//                             else if (k == 'heightMinor') {_k = 'Inches'}
//                             else if (k == 'metric') {return null}
//                             else {_k = k}
//                             body.push(<div className="basic-info-elem">
//                                     <div>{_k}:</div>
//                                     <div>{value[k]}</div>
//                                 </div>
//                             )
//                         }
//                     )
//                     body.push(<br/>)
//                 }
//             }
//             if (typeof(value) == 'array') {
                
//             }
//         }
//         console.log(body)
//         return body
//     }

//     // getUserInfo = () => {
//     //     console.log(this.props.user)
//     //     // makeGetRequest(`admin-user-info?user_id=${this.state.user_id}`, 
//     //     //     (data) => {
//     //     //         console.log('USER INFO:', data)
//     //     var user = this.props.user

//     //     // LIKED IMGS
//     //     var liked_images = user.swipe_responses ?
//     //     user.swipe_responses.filter(
//     //         (item) => {
//     //             return item.response == 'yes'
//     //         }
//     //     ) :
//     //     []
//     //     liked_images = liked_images.map(
//     //         (item) => {
//     //             return <img className="liked-img" src={item.img_id} alt="" />
//     //         }
//     //     )

//     //     // BASIC INFO
//     //     var body = []
//     //     for (let [key, value] of Object.entries(this.props.user)) {
//     //         if (typeof(value) == 'string'){
//     //             body.push(<div className="basic-info-elem">
//     //                     <div>{key}:</div>
//     //                     <div>{value}</div>
//     //                 </div>
//     //             )
//     //         }
//     //     }
//     //     console.log(body)

//     //     // REQUESTS
//     //     var requests = user.requests ? user.requests : []
//     //     requests = requests.map(
//     //         (req) => {
//     //             return <div>{req.request}</div>
//     //         }
//     //     )

//     //     this.state = {
//     //         user_info: body,
//     //         liked_images,
//     //         requests
//     //     }   
//     //     //     }
//     //     // )
//     // }

//     // getUserRequests = () => {
//     //     console.log('GETTING REQUESTS')
//     //     makeGetRequest(`stylist-user-requests?user_id=${this.state.user_id}`,
//     //         (resp) => {
//     //             console.log('REQUESTS:', resp)
//     //             resp = resp.map(
//     //                 (item, idx) => {
//     //                     return <div>{item}</div>
//     //                 }
//     //             )
//     //             this.setState({requests: resp})
//     //         }
//     //     )
//     // }

//     // getLikedImages = () => {
//     //     makeGetRequest(`like-product?user_sub=${this.state.user_id}`, 
//     //         (data) => {
//     //             console.log('LIKED IMAGES:', data)
//     //             this.setState({
//     //                 liked_images: data.map(
//     //                     (img) => {return <img className="liked-img" src={img.img_id}/>}
//     //                 )
//     //             })
//     //         }
//     //     )
//     // }

//     render() {
//         console.log(this.state.user_info)
//         return (
//             <div className="userInfo panel">
//                 <div className="medium">User Info</div>
//                 <div className="small"><strong>Basic info</strong></div>
//                 <div className="basic-info">
//                     {this.state.user_info}
//                 </div>
//                 <div className="small"><strong>Requests</strong></div>
//                 <div className="basic-info">
//                     {this.state.requests}
//                 </div>
//                 <div className="small"><strong>Liked images</strong></div>
//                 <div className="liked-imgs">
//                     {this.state.liked_images}
//                 </div>
//             </div>
//         )
//     }
// }

// export default UserInfo