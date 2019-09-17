import React, { Component } from "react"
import { connect } from "react-redux"
import { makePostRequest } from "../api_calls"
import Swiping from "./Swiping"
import "./Signup.css"
import {Redirect } from "react-router-dom"
import { Auth } from "aws-amplify"
import back from "../images/icons/arrow.png"
import Dropdown from "../general/form_components/Dropdown"
import queryString from "query-string"
import Sizing from "./Sizing"
import NewRequest from "./NewRequest"
import Style from "./Style"
import { resolve } from "dns";

class Signup extends Component {
    constructor(props) {
        super(props)
        var start_slide = 0
        if (this.props.slide != null) {
            start_slide = this.props.slide
        }

        var params = queryString.parse(window.location.search)
        this.state = {
            slide: start_slide,
            name: '',
            phone_number: '',
            username: '',
            contact_method: 'instagram',
            location: '',
            gender: '',
            acq_channel: '',
            password: '',
            instagram: '',
            referral: params.referral ? params.referral : '',
            age: '',
            price_range: '',
            num_is_valid: false,
            swipe_ready: false
        }
    }

    handleChange = (event) => {
        var val = event.target.id
        var key = event.target.value
        this.setState({[val]: key},
            () => {
                console.log(this.state)
            }    
        );
    }

    handleNumChange = (num, isValid) => {
        this.setState({
            phone_number: num,
            num_is_valid: isValid
        },
            () => {
                console.log('new num:', this.state.phone_number)
                console.log('is it valid?', this.state.num_is_valid)
            }
        )

    }

    handleOptionChange = (event) => {
        window.analytics.track('option selected')
        this.setState({[event.target.name]: event.target.value},
            () => {
                console.log(this.state)
            }
        )
    }

    nextPage = () => {
        window.analytics.track('Sign up button clicked')
        console.log('going to next slide')
        var slide = this.state.slide
        if (slide == 0) {slide +=1}
        slide += 1
        this.setState({slide}, () => {console.log(this.state)},
        //     () => {history.push(`/?t=${this.state.slide}`)}
        )
        console.log(this.state.gender)
    }

    prevPage = () => {
        var slide = this.state.slide
        if (slide == 2) {slide -=1}
        slide -= 1
        this.setState({slide})
        this.setState({slide}, () => {console.log(this.state)},
        //     () => {history.push(`/?t=${this.state.slide}`)}
        )
    }

    goToApp = () => {
        console.log('going to app')
    }

    makeid(length) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        };
        return text;
    }

    checkValidInstagram = () => {
        return new Promise(
            (resolve, reject) => {
                fetch(`https://www.instagram.com/${this.state.instagram}/`)
                .then(
                    (data) => {
                        // console.log(data)
                        // data = data.body
                        console.log(data)
                        data = data.text()
                        .then(
                            (data) => {
                                console.log(data)
                                console.log(typeof(data))
                                var found_page = !data.includes('Page Not Found')
                                console.log(found_page)
                                resolve(found_page)
                            }
                        )
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                )
            }
        )
    }
    
    signUp = async () => {
        window.analytics.track('Submit signup button clicked')
        try {
            var foundpage = await this.checkValidInstagram()
        }
        catch (err) {
            console.log(err)
            return
        }
        if (!foundpage) {
            this.setState({invalid_instagram: true})
            setTimeout(
                () => {
                    this.setState({invalid_instagram: false})
                },
                    2000
            )
            return
        }
        this.nextPage()
        console.log('submitting')
        var username = this.state[this.state.contact_method]
        var password = this.makeid(8)
        this.setState({
            password: password
        })
        Auth.signUp(username, password)
        .then(
            () => {
                console.log('Signing in')
                Auth.signIn(username, password)
                .then(
                    data => {
                        this.props.dispatchLogin()
                        console.log('Getting session')
                        console.log('cognito response after sign in:', data)
                        makePostRequest('sign-up', this.state,
                                () => {
                                    console.log('signed up')
                                    window.analytics.track('User signed up')
                                }
                            )
                    },
                    err => {
                        console.log('AN ERROR OCCURED WHILST SIGNING IN')
                        console.log(err)
                        this.handleErrors(err)
                    }
                )
            },
            err => {
                console.log('AN ERROR OCCURED WHILST SIGNING UP')
                console.log(err)
                this.handleErrors(err)
            }
        )
    };

    handleErrors = (err) => {
        if (err.name == 'UsernameExistsException') {
            this.setState({redirect: '/login'})
        }
    }

    updateDetails = () => {
        this.nextPage()
        this.props.setUserInfo(this.state)
    }

    getSlides = () => {
        console.log(this.state.num_is_valid && this.state.name)
        var contactTarget = this.state.contact_method == 'instagram' ? this.state.instagram : this.state.phone_number
        console.log('TARGET:', contactTarget)
        var signupValid = this.state.name && contactTarget != ''
        var slides = [
            <React.Fragment>
                <div className="rolling-container">
                <div className="large" id="first-title" style={{opacity: this.state.slide >= 6 ? 0 : 1}}>
                    MEET ADLA
                </div>
                    <div className="rolling medium rolling1">
                        Your free personal stylist over Instagram DM 
                    </div>
                    <br/>
                    {/* <div className="rolling medium rolling1">
                        Your free personal stylist
                    </div>
                    <br/>
                    <div className="rolling medium rolling2">
                        Adla hooks you up with clothes you’ll love. 
                    </div>
                    <br/>
                    <div className="rolling medium rolling3">
                        Chat to Adla over instagram dm or text.                     
                    </div>
                    <br/>
                    <div className="rolling medium rolling4">
                        Get clothes to try on at home for free.                     
                    </div>
                    <br/>
                    <div className="rolling medium rolling5">
                        No subscription or any extra strings attached. 
                    </div>
                    <br/> */}
                </div>
                {/*this.props.logged_in ? "/app/new_request" :*/}
                <button onClick={this.nextPage} className="btn first-btn" id="lets-do-this" style={{fontSize: "22px"}} >
                    <div className="shine-container">
                        <div className="shine"></div></div>
                    GET CLOTHES!
                </button>
            </React.Fragment>
            ,
            <div></div>         // this is where the sliding elements are
            ,
            <React.Fragment>
                <div id="signup-bar" className="form-container">
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>
                    <div className="field-container">
                        <div className="field-title">
                            Name
                        </div>
                        <input className="text-response" id="name" value={this.state.name} onChange={this.handleChange} placeholder="What can I call you?"/>
                    </div>
                    <div className="field-container">
                        {
                            // this.state.contact_method == 'instagram' ?
                            <>
                            <div className="field-title">
                                Instagram
                            </div>

                            <input className={this.state.invalid_instagram ? "invalid-input text-response" : "text-response"} id="instagram" value={this.state.instagram} onChange={this.handleChange} placeholder="yourusername"/> 
                            {/* <div className="field-caption" onClick={() => {this.setState({contact_method: 'phone_number'})}}>
                                Don't use Instagram? Text adla
                            </div> */}
                            </>
                            // :
                            // <>
                            // <div className="field-title">
                            //     Number
                            // </div>
                            // <TelephoneInput value={this.state.phone_number} onChange={this.handleNumChange}/>
                            // <div className="field-caption" onClick={() => {this.setState({contact_method: 'instagram'})}}>
                            //     Use instagram
                            // </div>
                            // </>
                        }
                     </div>
                    <button onClick={this.signUp} 
                        disabled={!signupValid} 
                        style={ signupValid ? null : {opacity : "0.5"}}>
                        Submit
                    </button>
                </div>
            </React.Fragment>
            ,
            <React.Fragment>
                <div className="form-container">
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>
                    <div className="field-container">
                        <div className="field-title">
                            Gender
                        </div>
                        <Dropdown onChange={this.handleOptionChange} id="gender" value={this.state.gender} prompt='Select one' name='gender' options={['Male', 'Female', 'Other']}/>
                    </div>
                    <div className="field-container">
                        <div className="field-title">
                            City
                        </div>
                        <Dropdown onChange={this.handleOptionChange} id="location" value={this.state.location} prompt='Where you at?' name='location' options={['London', 'Other']}/>
                        {/* 'San Francisco/Bay Area', */}
                    </div>
                    <button onClick={() => {this.updateDetails(); this.setState({swipe_ready: true})}} disabled={!(this.state.location && this.state.gender)} style={this.state.location && this.state.gender ? null : {opacity : "0.5"}}>
                        Next
                    </button>
                </div>
            </React.Fragment>
            ,
            <React.Fragment>
                <div className="form-container">
                    {/* <div className="field-container long-field-title">
                        <div className="field-title ">
                            What's your instagram username?
                        </div>
                        <input className="text-response" id="instagram" value={this.state.instagram} onChange={this.handleChange} placeholder="@username"/>
                    </div> */}
                    <div className="field-container">
                        <div className="field-title">
                            Do you have a referral code?
                        </div>
                        <input className="text-response" id="referral" value={this.state.referral} onChange={this.handleChange} placeholder="Got code?"/>
                    </div>
                    <button onClick={this.updateDetails} >
                        {this.state.referral == '' ? 'Nope' : 'Submit'}
                    </button>
                </div>
            </React.Fragment>
            ,
            <React.Fragment>
                <div className="form-container">
                    <div className="field-container long-field-title">
                        <div className="field-title ">
                            How much would you pay for an item you love?
                        </div>
                        <Dropdown onChange={this.handleOptionChange} id="price_range" value={this.state.price_range} prompt="What's your budget?" name='price_range' options={[40, 80, 120, 200, 1000]}/>
                    </div>
                    <div className="field-container long-field-title">
                        <div className="field-title">
                            Where did you hear about Adla? 
                        </div>
                        <Dropdown onChange={this.handleOptionChange} id="acq_channel" value={this.state.acq_channel} prompt='Let me know!' name='acq_channel' options={['Friend', 'Google', 'Instagram', 'Tinder', 'Other']}/>
                    </div>
                    <button onClick={this.updateDetails} disabled={!(this.state.price_range && this.state.acq_channel)} style={this.state.num_is_valid && this.state.name ? null : {opacity : "0.5"}}>
                        Submit
                    </button>
                </div>
            </React.Fragment>
            ,
            <React.Fragment>
                <div className="panel">
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>
                    <Swiping gender={this.state.gender} ready={this.state.swipe_ready}/>
                    {/* <Link to='/app'> */}
                        <button className="btn" onClick={this.nextPage}>
                            Move on
                        </button>
                    {/* </Link> */}
                </div>
            </React.Fragment>            
            ,
            <React.Fragment>
                <div className="form-container">
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>

                    <NewRequest not_now={this.nextPage} onSubmit={this.nextPage}/>
                </div>
            </React.Fragment>            
            ,
            <React.Fragment>
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>
                    <Style onSubmit={this.nextPage} onSubmit={this.nextPage} 
                    styles={this.props.user.styles ? this.props.user.styles : []}
                    onChange={(styles) => {
                        this.props.setUserInfo({styles});
                    }}
                    endpoint={'update-my-details'} styles={this.props.user ? this.props.user : []}/>
                    <button className="btn" onClick={this.nextPage}>Move on</button>
            </React.Fragment>            
            ,
            <React.Fragment>
                <div className="panel">
                    <img className="back back_slide" src={back} onClick={this.prevPage}/>
                    <Sizing gender={this.state.gender} onSubmit={this.nextPage}/>
                </div>
            </React.Fragment>            
        ]
        if (this.state.slide > slides.length - 1) {
            return <Redirect to={'/app'} />
        }
        var slide_colors = [
            '#FDF5EA',
            '#FDF5EA',
            '#C6E0F5'
        ]
        // TRANSLATE THE SLIDES ACROSS AS THE PAGE CHANGES
        slides = slides.map(
            (item, idx) => {
                return (
                    // <div className="slide" style={{transform: `translateX(-${this.state.slide * (idx)}00vw)`}}>        
                    <div className="slide" style={{transform: `translateX(-${(100 * this.state.slide)}vw)`, backgroundColor: slide_colors[0]}}>        
                        {item}
                    </div>
                )   
            }
        )
        return slides
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to={this.state.redirect} />
            )
        }
        return (
            <div className={`fold`} style={{backgroundColor: '#FDF5EA'}}>
                <div className="slide-container">
                    {this.getSlides()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log('SIGNUP USER:', state.user)
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (update) => {
            makePostRequest('update-my-details', update,
                () => {
                    console.log('user updated')
                }
            )
            dispatch({
                type: "SET_USER",
                update: update
            })
        },
        dispatchLogin: () => {
            dispatch({
                type: "LOG_IN"
            })
        }
    }
}

export default Signup = connect(mapStateToProps, mapDispatchToProps)(Signup)