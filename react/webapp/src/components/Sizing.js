import React, { Component } from "react"
import { makePostRequest } from "../api_calls"
import Dropdown from "../general/form_components/Dropdown";

class Sizing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            heightMajor: '',
            heightMinor: '',
            country_standard: 'US sizing',
            metric: false,
            dress_size: '',
            waist: '',
            leg_length: ''
        }
    }

    handleChange = (e) => {
        var key = e.target.id
        var val = e.target.value



        console.log(val)
        if (key == 'heightMajor' ||  key == 'heightMinor') {
            val = val.match(/\d+/g)
            if (val != null) {
                val = val[0]
            }
            else {
                val = ''
            }
            console.log(val)
        }

        this.setState({[key]: val},
            () => {
                console.log(this.state)
            }    
        )
    }

    handleSubmit = () => {
        makePostRequest('update-my-details', {size: this.state},
            () => {
                console.log('size updated')
            }
        )
    }

    render() {
        console.log('GENDER:', this.props.gender)
        return (
            <div className="form-container">
                <div className="medium form-title">
                    Sizing
                </div>
                <div className="small form-caption">
                    Let me know how things fit you!
                    <br/>
                    <br/>
                    Don't worry if you don't know... You can let me know this at any point later!
                </div>
                {
                    this.props.gender == 'Female' ?
                    <>
                        <div className="field-container">
                            <div className="field-title">
                                Sizing standard (country)
                            </div>
                            <Dropdown id="country_standard" value={this.state.country_standard} onChange={this.handleChange} options={['UK sizing', 'US sizing']} prompt='select'/>
                        </div>
                        <div className="field-container">
                            <div className="field-title">
                                Dress size
                            </div>
                            <Dropdown id="dress_size" value={this.state.dress_size} onChange={this.handleChange} options={['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32']} prompt='select'/>
                        </div>
                        <div className="height-field-container">
                            <div className="field-title">
                                Height
                            </div>
                            <div className="height-field">
                                <input id="heightMajor" value={this.state.heightMajor} onChange={this.handleChange} className="text-response"/>
                                <div className="height-field-label">{ this.state.metric ? 'm' : 'Ft'}</div>
                            </div>
                            <div className="height-field">
                                <input id="heightMinor" value={this.state.heightMinor} onChange={this.handleChange} className="text-response"/>
                                <div className="height-field-label">{ this.state.metric ? 'cm' : 'In'}</div>
                            </div>
                        </div>
                        
                    </>
                    :
                    <>
                        <div className="field-container">
                            <div className="field-title">
                                Sizing standard (country)
                            </div>
                            <Dropdown id="country_standard" value={this.state.country_standard} onChange={this.handleChange} options={['UK sizing', 'US sizing']} prompt='select'/>
                        </div>
                        <div className="field-container">
                            <div className="field-title">
                                Waist size 
                            </div>
                            <input id="waist" value={this.state.waist} onChange={this.handleChange} className="text-response"/>
                        </div>
                        <div className="field-container">
                            <div className="field-title">
                                Leg length
                            </div>
                            <input id="leg_length" value={this.state.leg_length} onChange={this.handleChange} className="text-response"/>
                        </div>
                        <div className="height-field-container">
                            <div className="field-title">
                                Height
                            </div>
                            <div className="height-field">
                                <input id="heightMajor" value={this.state.heightMajor} onChange={this.handleChange} className="text-response"/>
                                <div className="height-field-label">{ this.state.metric ? 'm' : 'Ft'}</div>
                            </div>
                            <div className="height-field">
                                <input id="heightMinor" value={this.state.heightMinor} onChange={this.handleChange} className="text-response"/>
                                <div className="height-field-label">{ this.state.metric ? 'cm' : 'In'}</div>
                            </div>
                        </div>
                        
                    </>
                }
                <button onClick={() => {
                    this.handleSubmit(); 
                    if (this.props.onSubmit) {
                        this.props.onSubmit()
                    } 
                }}>
                    Move on
                </button>
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         gender: state.user.gender
//     }
// }

export default Sizing //= connect(mapStateToProps)(Sizing)