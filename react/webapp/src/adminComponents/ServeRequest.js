import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import queryString from "query-string"
import Timeline from "../components/Timeline"
import SlideUpPanel from "../components/SlideUpPanel"
import { connect } from "react-redux"
import MakeRecommendations from "./MakeRecommendations"
import UserInfo from "./UserInfo"

export default class ServeRequest extends Component {
    constructor(props) {
        super(props)
        this.path = this.props.match.path
        var params = queryString.parse(this.props.location.search)
        console.log(params)
        this.state = {
            userSub: params.sub,
            req_id: params.req_id,
            request: [],
            currStatus: 'request',
            formatting: [],
            recommendations: [],
            formatted: []
        }
        makeGetRequest(`user-request?sub=${this.state.userSub}&req_id=${this.state.req_id}`, 
            (request) => {
                this.setState({
                    request: request
                })
            }
        )

        this.getRecommendations()

        
    }

    getRecommendations = () => {
        console.log('getting latest recommendations')
        makeGetRequest(`admin-recommendations?sub=${this.state.userSub}&req_id=${this.state.req_id}`, 
            (recs) => {
                console.log('recommendations:', recs)
                this.setState({
                    recommendations: recs
                })
            }
        )

    }

    imageReceived = () => {
        console.log('img received')
    }

    format = () => {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        /*var img = new Image();
        img.onload = function() {
            console.log('image loaded')
            //context.drawImage(this, 40, 40);
            // call next step in your code here, f.ex: nextStep();
        };
        img.crossOrigin = 'Anonymous'
        img.addEventListener("load", this.imageReceived, false);
        img.src = 'https://s3-eu-west-1.amazonaws.com/Adla-data/public/recommended_items/85e24393-57a0-40b5-bf8b-855d0c2519e6'//this.state.recommendations[0].img_urls[0];
        */
        var img = <img crossOrigin="anonymous" src={'https://s3-eu-west-1.amazonaws.com/Adla-data/public/recommended_items/85e24393-57a0-40b5-bf8b-855d0c2519e6'}/>
        
        console.log('drawing img')
        console.log(img)
        context.drawImage(img, 40, 40);
        var URL = canvas.toDataURL()
        console.log(URL)

        /*
        setTimeout(
            () =>{
                var items = this.state.recommendations
                items.map(
                    (item, idx) => {
                        console.log('formatter:', document.querySelector(`#formatter${idx}`))
                        html2canvas(document.querySelector(`#formatter${idx}`),  
                            { 
                                letterRendering: 1, 
                                allowTaint : true, 
                                scrollY: -window.scrollY,
                                onrendered : function (canvas) { } 
                            }
                        )

                        .then(canvas => {
                            document.querySelector('.body').appendChild(canvas)
                            let URL = canvas.toDataURL()
                            console.log('URL:', URL)
                            this.setState({
                                formatted:
                                    [
                                        {
                                            dataURL: URL,
                                            id: idx
                                        },
                                        ...this.state.formatted
                                    ]
                            })

                        })
                    }
                )
            },
            2000
        )
        */
    }

    getFormatters = () => {   
        if (this.state.recommendations.length == 0) {return null}       // before recommendations recieved
        var items = this.state.recommendations
        return items.map(
            (item, idx) => {
                item = {
                    idx,
                    src: item.img_urls[0],
                    price: `$${100*idx}`
                }
                return <Formatter id={`formatter${idx}`} item={item} />
            }
        )
    }

    sendRecommendations = () => {
        var loc = window.location.search
        var params = queryString.parse(loc)
        var sub = params.sub
        var req_id = params.req_id
        var recs = this.state.recommendations
        console.log('RECS:', recs)
        recs = recs.filter((rec) => {return rec.status == 'not yet recommended'})
        console.log('recs to recommend:', recs)
        var body = {recs, action: 'recommend'}
        makePostRequest(`update-recommendation?req_id=${req_id}&sub=${sub}`, body,
            () => {
                console.log('recommendation made') 
                this.getRecommendations()
            }
        )
    }

    render () {
        return (
            <React.Fragment >
                <div className="body">
                    <div className="large">
                        Request
                    </div>
                    <UserInfo />
                    <Timeline request={this.state.request} recommendations={this.state.recommendations} refresh={this.getRecommendations}/>
                    <ChangeRequestStatusBtn currStatus={this.state.currStatus} refresh={this.getRecommendations}/>
                    {/*<button className="btn" onClick={this.format} id='format'>Format</button>
                    <canvas id="canvas" width="336" height="336"></canvas>/*}
                    {/*this.getFormatters()*/}
                    <button className="btn" onClick={this.sendRecommendations} style={{backgroundColor: 'rgb(255, 0, 0, 0.5)'}}>Send these recommendations</button>
                </div>
                <SlideUpPanel />
            </React.Fragment>
        )
    }
}

class ChangeRequestStatusBtn extends Component {
    constructor(props) {
        super(props)
        this.statusToAction = {
            'request': 'Make recommendations!',
            'making recs': 'keep making recommendations'
        }
    }

    getChangeOption = () => {
        var currStatus = this.props.currStatus
        var option = !currStatus === "request" ? 
                <button className="btn" style={{fontSize: "12px"}} onClick={() => this.props.openSlideUp(<ChangeStatus status={currStatus} refresh={this.props.refresh}/>)}>
                    {this.statusToAction[currStatus]}
                </button>
                :
                null
    }

    render () {
        return (
            <React.Fragment>
                <button className="btn" style={{fontSize: "12px"}} onClick={() => this.props.openSlideUp(<ChangeStatus refresh={this.props.refresh} />)}>
                    Make recommendations
                </button>
                {this.getChangeOption()}
            </React.Fragment>
        )
    }
}

const Formatter = (props) => {
    console.log('formatter props:', props)
    if (!props.item) { 
        console.log('no item in props')
        return null 
    }
    const {idx, src, price} = props.item
    console.log('SRC:', src)
    return (
        <div id={props.id} className="formatter">
            <div className="idx">{`${idx + 1}.`}</div>
            <img crossOrigin="Anonymous" src={src} alt="" className="img" />
            <div className='price'>{price}</div>
        </div>
    )
}


// SWITCH TO DETERMINE WHAT COMPONENT TO RENDER ON THE SLIDEUP PANEL
const ChangeStatus = (props) => {

    const statusToTitle = {
        'request': 'Make recommendations',
        'making recs': 'Make recommendations'
    }

    switch (props.status) {
        case 'request':
            return (
                <MakeRecommendations refresh={props.refresh}/>
            )
        default:
            return <MakeRecommendations refresh={props.refresh}/>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSlideUp: (content) => {
            dispatch({
                type: "OPEN_SLIDEUP",
                content: content
            })
        }
    }
}

ChangeRequestStatusBtn = connect(null, mapDispatchToProps)(ChangeRequestStatusBtn)