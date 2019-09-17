import React, { Component } from 'react'
import { Redirect } from "react-router-dom"
import "./SignUp.css"
import ReactTelInput from "react-telephone-input/lib/withStyles"
import { Auth } from "aws-amplify"
import posed from 'react-pose';
import { connect } from "react-redux";
import TelephoneInput from "./TelephoneInput"
import logo from "../images/Adla.png";
import "./form_components/Forms.css"
import { makePostRequest, makeGetRequest } from "../api_calls"
import Dropdown from "../general/form_components/Dropdown"
import Swiping from "./Swiping"

const Question = posed.div({
    invalid: { 
        color: "#ff0000",
        borderColor: "#ff0000"
    },
    valid: { 
        color: "#000000" 
    }
});

class SignUp extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            name: '',
            phone_number: '',
            location: '',
            gender: '',
            acq_channel: '',
            password: '',
            request: '',
            budget: '',
            instagram: '',
            age: '',
            page: 1,
            invalids: [],
            num_is_valid: false
        }

        this.questions = {
            1: [
                "name",
                "request",
                "budget",
                "phone_number"
            ],
            2: [
                "location",
                "gender",
                "acq_channel"
            ],
            3: [
                "instagram",
                "age"
            ]
        }
    }
    
    componentDidMount = () => {
        window.analytics.page('Sign up')
    }

    handleChange = (event) => {
        var val = event.target.id
        var key = event.target.value
        this.setState({[val]: key});
        console.log(this.state)
    }

    handleNumChange = (num, isValid) => {
        this.setState({
            phone_number: num,
            num_is_valid: isValid
        },
            () => {
                //console.log('new num:', this.state.phone_number)
                //console.log('is it valid?', this.state.num_is_valid)
            }
        )
        console.log('----------')
    }

    handleOptionChange = (event) => {
        window.analytics.track('option selected')
        this.setState({[event.target.name]: event.target.value},
            () => {
                console.log(this.state)
            }
        )
    }

    // handleSubmit = (event) => {
    //     alert('submitted: ' + this.state.value)
    //     event.preventDefault()  
    // }

    nextPage = () => {
        var part = this.state.page
        if (this.validate(part)) {
            this.setState({page: this.state.page + 1})
        }
        else {
            console.log('pt1 invalid')
        }
    }

    containsSomething = (val) => {
        return val !== ""
    }

    // updatePhoneNumberValidity = (validInTelInputComponent) => {
    //     this.setState({num_is_valid: validInTelInputComponent})
    // }

    isValidPhoneNumber = () => {
        return this.state.num_is_valid
    }

    validate = (part) => {
        const checks = {
            phone_number: [this.isValidPhoneNumber],
            optional: ['instagram', 'age']
        }
        this.state.invalids = []
        var allValid = this.questions[part].map(
            (keyName) => {
                console.log(keyName)
                if (checks.optional.includes(keyName)) return true;     // return true if this input is optional
                var validation_functions = [this.containsSomething]
                if (checks[keyName]) {validation_functions.push(...checks[keyName])}
                console.log('checking validity of', keyName, 'with functions:', validation_functions)
                var valid = validation_functions.map(
                    f => {
                        console.log(this.state[keyName])
                        return f(this.state[keyName])
                    }
                )

                valid = valid.every(item => item === true)
                if (!valid) {
                    this.promptInvalidResponse(keyName)
                }
                console.log(keyName, 'valid?', valid)
                return valid
            }
        ).every(item => item == true)
        console.log('all inputs on this page are valid?', allValid)
        return allValid
    }

    promptInvalidResponse = (value) => {
        this.state.invalids.push(value)
        window.analytics.track('sign up failed', {inputs: this.state})
        this.setState({invalids: this.state.invalids}, function () {
             //console.log('invalid responses:', this.state.invalids);
        })
    }

    invalidAnimation = (value) => {
        var invalid = this.state.invalids.includes(value)
        return invalid
    }

    makeid(length) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        };
        return text;
    }

    get = (what) => {
        const state = this.state
        switch (what) {
            case "details":
                return {
                    name: state.name,
                    phone_number: state.phone_number,
                    location: state.location,
                    gender: state.gender,
                    acq_channel: state.acq_channel,
                    password: state.password,
                    instagram: state.instagram,
                    age: state.age
                }
            default:
                break
        }

    }

    signUp = () => {
        window.analytics.track('Submit signup button clicked')
        if (this.validate(this.state.page)) {
            this.nextPage()
            console.log('submitting')
            var phone_number = this.state.phone_number
            var password = this.makeid(8)
            this.setState({
                password: password
            })
            Auth.signUp(phone_number, password)
            .then(
                () => {
                    console.log('Signing in')
                    Auth.signIn(phone_number, password)
                    .then(
                        data => {
                            this.props.dispatchLogin()
                            console.log('Getting session')
                            console.log('cognito response after sign in:', data)
                            makePostRequest('make-request', this.state,
                                    () => {
                                        console.log('request made')
                                        this.props.setRequests()
                                        window.analytics.track('User signed up')
                                        window.analytics.track('Request made')
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
        }
    };

    updateDetails = () => {
        console.log(this.validate(this.state.page))
        if (this.validate(this.state.page)) {
            this.nextPage()
            console.log('update details body:', this.get('details'))
            makePostRequest('update-my-details', this.get('details'), 
                () => {
                    console.log('details updated')
                }
            )
        }
    }

    render() {
        if (this.state.redirect) {
            console.log('rendering redirect')
            return <Redirect to="/login" />
        }
        switch (this.state.page) {
            case 1:
                return (
                    <>
                        <div className="small" id="part-1">
                            {/* NAME */}
                            <Question className="question" pose={this.invalidAnimation('name') ? 'invalid' : 'valid'} >
                                <div className="ask small">
                                    <strong>What can I call you?</strong>
                                </div>
                                <input className="text-response" id="name" placeholder="Your name" onChange={this.handleChange} />
                            </Question>
                        
                            {/* REQUEST */}
                            <Question className="question" pose={this.invalidAnimation('request') ? 'invalid' : 'valid'} >
                                <div className="ask small">
                                    <div>
                                        <strong>What can I find for you?</strong>
                                    </div>
                                </div>
                                <div className="subheading">Be as specific as you like!</div>
                                <textarea className="text-response" id="request" placeholder="For example: 'I need a sparkly party dress that will go with my new heels'" onChange={this.handleChange} ></textarea>
                            </Question>
                        
                            {/* BUDGET */}
                            <Question className="question" pose={this.invalidAnimation('budget') ? 'invalid' : 'valid'} >
                                <div className="ask small">
                                    <div>
                                        <strong>What's your rough budget?</strong>
                                    </div>
                                </div>
                                <input className="text-response" id="budget" placeholder="I'm looking to spend around..." onChange={this.handleChange} />
                            </Question>
                        
                            {/* NUMBER */}
                            <Question className="question" pose={this.invalidAnimation('phone_number') ? 'invalid' : 'valid'} >
                                <div className="ask small"><strong>What's your mobile number?</strong></div>
                                <div className="small">I'll sort out your clothes much faster by messaging.</div>
                                <TelephoneInput className="tel-input" onChange={this.handleNumChange}/>
                                <button className="main_button btn" id="submit-1" onClick={this.signUp}>
                                        Talk to Adla!
                                </button>
                            </Question>
                    
                        </div>
                    </>
                )
            case 2:
                return (
                    <div className="index-body body">
                    <div className="panel" id="part-2">
                        {/* GENDER */}
                        <Question className="question" pose={this.invalidAnimation('gender') ? 'invalid' : 'valid'} >
                            <div className="ask small">What gender do you identify with?</div>
                        
                            <div className="single-choice-response" id="sex">
                                <input id="female" className="radio_btn" type="radio" name="gender" value="female" onChange={this.handleOptionChange}/>
                                <label htmlFor="female" className="quiz_option">Female</label>
                                <br />
                                <input id="male" className="radio_btn" type="radio" name="gender" value="male" onChange={this.handleOptionChange}/>
                                <label htmlFor="male" className="quiz_option">Male</label>
                                <br />
                                <input id="other_gender" className="radio_btn" type="radio" name="gender" value="other" onChange={this.handleOptionChange}/>
                                <label htmlFor="other_gender" className="quiz_option">Other</label>
                                <br />
                            </div>
                        </Question>
                        
                        {/* LOCATION */}
                        <Question className="question" pose={this.invalidAnimation('location') ? 'invalid' : 'valid'} >
                            <div className="ask small">What city are you in?</div>
                            <Dropdown onChange={this.handleOptionChange} id="location" value={this.state.location} prompt='Where you at?' name='location' options={['London', 'San Francisco/Bay Area', 'Other']}/>
                        </Question>
                        
                        {/* ACQ CHANNEL */}
                        <Question className="question" pose={this.invalidAnimation('acq_channel') ? 'invalid' : 'valid'} >
                            <div className="ask small">How did you hear about Adla?</div>
                            <div className="single-choice-response" id="found_Adla_through">
                                <input id="instagram" className="radio_btn" type="radio" name="acq_channel" value="instagram" onChange={this.handleOptionChange}/>
                                <label htmlFor="instagram" className="quiz_option">Instagram</label>
                                <br />
                                <input id="friend" className="radio_btn" type="radio" name="acq_channel" value="friend" onChange={this.handleOptionChange}/>
                                <label htmlFor="friend" className="quiz_option">Friends</label>
                                <br />
                            <input className="text-response extra-detail not-required" name="acq_channel" id="custom-acq-channel" placeholder="Somewhere else?" onChange={this.handleOptionChange}/>
                            </div>
                            <button className="main_button btn" id="submit-2" onClick={this.updateDetails}>
                                {this.state.loading ? 
                                <img src={logo} className="loading" alt=""/>:
                                "Show me some styles!"}
                            </button>
                        </Question>
                    </div>
                    </div>
                )
            case 3:
                return (
                    <div className="">
                        <div className="panel" id="part-2">
                            Let me know which of these you like!
                            <Swiping nextPage={this.nextPage}/>
                            <button className="main_button btn" id="submit-2" onClick={this.updateDetails}>
                                {this.state.loading ? 
                                <img src={logo} className="loading" alt=""/>:
                                "Finish it off..."}
                            </button>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="index-body body">
                        <div className="panel" id="part-2">
                            {/* INSTAGRAM */}
                            <Question className="question" pose={this.invalidAnimation('instagram') ? 'invalid' : 'valid'} >
                                <div className="ask small">
                                    What's your instagram handle?
                                </div>
                                <input className="text-response" id="instagram" placeholder="@myinstagramhandle" onChange={this.handleChange} />
                            </Question>
                            
                            {/* AGE */}
                            <Question className="question" pose={this.invalidAnimation('age') ? 'invalid' : 'valid'} >
                                <div className="ask small">What's your age?</div>
                                <input className="text-response" id="age" placeholder="My age is..." onChange={this.handleChange} />
                            <button className="main_button btn" id="submit-2" onClick={this.updateDetails}>
                                {this.state.loading ? 
                                <img src={logo} className="loading" alt=""/>:
                                "Find those clothes!"}
                            </button>
                            </Question>
                        </div>
                    </div>
                )
            default:
                return <Redirect to={{pathname: "/whatsapp", request: this.state.request}}/>
        }
        
    }

    handleErrors = (err) => {
        console.log('handling error:', err)
        console.log('type:', err.code)
        if (err.code === 'UsernameExistsException') {
            console.log('user already exists')
            this.setState({redirect: true})
        }
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchLogin: () => {
            dispatch({
                type: "LOG_IN"
            })
        },
        setRequests: () => {
             makeGetRequest('get-my-requests', data => {
                data = JSON.parse(data.body)
                console.log(data)
                dispatch({type: "SET_REQUESTS", requests: data})
            })
        }
    }
}

// export default SignUp = connect(null, mapDispatchToProps)(SignUp)