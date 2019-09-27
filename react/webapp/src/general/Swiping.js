import React, { Component } from "react"
import "./Swiping.css"
import { importAll } from "../utils"
import { makePostRequest, makeGetRequest } from "../api_calls"
import heart from "../images/icons/heart.png"
import cross from "../images/icons/cross-filled.png"
import { connect } from "react-redux";
import Loading from "./Loading"

class Swiping extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        // GET INITIAL ITEMS BEFORE API RETURNS REST
        let items = []
        // if (window.location.href == 'https://adla.site') {
        //     var f = require.context(`../images/swipe-images`, false)
        //     f.keys().map(
        //         (item, index) => { 
        //             items[index] = f(item)
        //         }
        //     )
        //     items = items.slice(0, 5)
        // }
       
        this.state = {
            items: [],
            // remaining: 0,
            responses: []
            // swiped: items.map((item) => {return null}),
            // handlingIdx: items.length - 1
        }
    }
    
    getImgs = () => {
        console.log('GETTING IMGS')
        if (this.props.gender) {
            console.log('GENDER:', this.props.gender)
            var gender = this.props.gender.toLowerCase()
            // var gender = 'male'
            makeGetRequest(`swipe-products?gender=${gender}`, 
                (data) => {
                    data = data.filter(
                        (d) =>{
                            // console.log(d)
                            // console.log('swipes:', this.props.swipes)
                            if (this.props.swipes.includes(d)) {
                                console.log('item already in list')
                            }
                            return !this.props.swipes.includes(d)
                        }
                    )
                    console.log('# new items being appended:', data.length)
                    var items = [...this.state.items, ...data]
                    // var remaining = this.state.remaining + data.length
                    // var responses = [...this.state.responses]
                    this.setState({
                        items,
                        // remaining,
                        // responses
                        // swiped: [...data.map(() => {return null}), ...this.state.swiped],
                        // handlingIdx: this.state.handlingIdx + data.length
                    },
                        () => {
                            // console.log(this.state)
                        }
                    )
                }
            )
        }
        // GET IMAGES TO SWIPE ON FROM API
    }

    // handle = () => {
    //     this.setState({
    //         handlingIdx: this.state.handlingIdx -= 1
    //     })
    // }

    respond = (response) => {
        // var s = this.state.swiped
        // s[idx] = response
        // console.log(this.state.items)
        // this.setState({swiped: s})
        // this.handle()
        // makePostRequest('like-product',
            // {
        //         img_id: this.state.items[idx],
        //         response: response
            // },
        //     () => {console.log('products liked')}
        // )
        console.log('RESPONDING')
        var responses = this.state.responses
        responses.push(response)
        console.log('responses:', responses)
        var img_url = this.state.items[this.state.responses.length - 1]     // when no responses, get first item
        console.log('linking img:', img_url)
        this.setState({
            responses//,
            // remaining: this.state.remaining - 1
        })
        this.props.respond(img_url, response)
    }
 
    getCards = () => {
        var cards = this.state.items.map(
            (item, idx) => {
                console.log('idx:', idx)
                // console.log('remaining:', this.state.remaining)
                var zIndex = 1 + this.state.responses.length - idx
                console.log('zIndex:', zIndex)
                return <Card src={item} alt="" respond={this.respond} swiped={this.state.responses[idx]} active={idx == this.state.responses.length} zIndex={zIndex} />
            }
        )
        return cards
    }

    render() {
        var ready
        if (this.props.ready == null) {                 // if certain conditions need to be met before fetching imgs (e.g. register gender on signup) then 
            ready = true
        }
        else {
            ready = this.props.ready   
        }
        // console.log('items length:', this.state.items.length)
        // console.log('logged in:', this.props.logged_in)
        // console.log('ready?', ready)
            // console.log(this.state.handlingIdx)
            // console.log(this.props.logged_in)
            // console.log(ready)
        // if (this.state.handlingIdx <= 2 && this.props.logged_in && ready) {
        if (this.state.items.length - this.state.responses.length < 3 && ready) {
            this.getImgs()
        }
        return (
            <div>
                <div className="swipe_cards">
                    {
                        this.state.items ?
                        this.getCards()
                        : <Loading />
                    }
                </div>
                <div className="swipe_options">
                    <div className="swipe_dislike_btn" onClick={() => {this.respond('no')}}>
                        <img src={cross} alt="" />
                    </div>
                    <div className="swipe_like_btn" onClick={() => {this.respond('yes')}}>
                        <img src={heart} alt="" />
                    </div>
                </div>
            </div>
        )
    }
}

class Card extends Component {
    constructor(props) {
        super(props)
        this.decisionPoint = 100;
        this.state = {
            startX: 0,
            swiped: null,
            // centering: false,
            loaded: false,
            // style: {zIndex: this.props.zIndex}
        }
    }

    touchStart = (e) => {
        var startX = e.changedTouches[0].pageX
        var startY = e.changedTouches[0].pageY
        this.setState({startX, startY})
    }

    swipe = (e) => {
        var curX = e.changedTouches[0].pageX 
        var deltaX = curX - this.state.startX
        var curY = e.changedTouches[0].pageY 
        var deltaY = curY - this.state.startY
        //console.log(`${curX} - ${this.state.startX} = ${deltaX}`)
        this.setState({style: 
            {
                ...this.state.style,
                transform: `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${0.1*deltaX}deg)`
            }
        })
    }

    let_go = (e) => {
        var deltaX = e.changedTouches[0].pageX - this.state.startX
        if (Math.abs(deltaX) > this.decisionPoint) {
            window.analytics.track('image swiped on sign up')
            if (deltaX > 0) {
                this.props.respond('yes')
                // this.setState({swiped: 'yes'})
            }
            else {
                this.props.respond('no')
                // this.setState({swiped: 'no'})
            }
        }
        else {
            this.setState({style: {transform: 'translateX(0vw) rotate(0deg)'}})
        }
        //     // this.setState({centering: 'centre'},
        //         // this.setState({centering: false})
        //     // )
        //     // this.setState({style:
        //     //     {'transform': 'translateX(0px) rotate(0deg)',}
        //     // })
        // }
    }

    render() {
        console.log('swiped prop:', this.props.swiped)
        let style = {...this.state.style}
        if (this.props.swiped) {
            if (this.props.swiped == 'yes') {
                style = {
                    ...style,
                    transform: 'translateX(100vw) rotate(90deg)'
                }
            }
            else if (this.props.swiped == 'no') {
                style= {
                    ...style,
                    transform: 'translateX(-100vw) rotate(-90deg)'
                }
            }
        }

        console.log('style:', style)
        if (this.props.active) {
            var p = {
                onTouchStart: this.touchStart,
                onTouchEnd: this.let_go,
                onTouchMove: this.swipe
            }
        }
        style = {...style, zIndex:this.props.zIndex}
        console.log(style)

        return (
            <div className={`swipe_card`} style={style} {...p} >
                <img src={this.props.src} alt="" onLoad={() => {this.setState({loaded: true})}}/>
                {
                    this.state.loaded ? 
                    null : 
                    <Loading />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('STATE:', state)
    return {
        logged_in: state.user.logged_in,
        gender: state.user.gender,
        swipes: state.user.swipe_responses ? state.user.swipe_responses : []
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        respond: (img_url, response) => {
            console.log('liking image:', img_url)
            makePostRequest('like-product',
                {
                    img_id: img_url,
                    response: response
                },
                () => {console.log('product liked')}
            )
            dispatch({
                type: 'SWIPE_IMG',
                response,
                img_url
            })
        }
    }
}

export default Swiping = connect(mapStateToProps, mapDispatchToProps)(Swiping)