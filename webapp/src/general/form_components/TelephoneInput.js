import React, {Component} from "react"
import dropdownArrow from "../../images/dropdownArrow.png"
import "./TelephoneInput.css"
import { rgbUnit } from "style-value-types";
import Dropdown from "./Dropdown"

class TelephoneInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: '+44',
            num: '',
            formattedNum: null,
            dropdownOpen: false,
            valid: false
        }
        this.countries = this.getCountries()
    }

    format = () => {
        var num = this.state.num == '' ? "012345678901" : this.state.num        // initially empty show 012345678901
        console.log('UNFORMATTED NUM:', num)
        switch (this.state.code) {
            case "+44": 
                if (num.length > 10) {
                    num = num.slice(1)
                }
                break;
            case "+1":
                if (num.length > 10) {
                    num = num.slice(1)
                }
                break;
            default:
                break;
        }
        return num
    }

    toggleDropdown = () => {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }

    getCountries = () => {
        const codes = {
                "UK": "+44",
                "US": "+1"
            }
        const countries = Object.keys(codes).map(
            (key, idx) => {
                return (
                    <CountryCode country={key} code={codes[key]} onClick={this.onCountryChange}/>
                )
            }
        )
        return (countries)
    }

    onNumChange = (e) => {
        var num = e.target.value
        switch (this.state.code) {
            case "+44": 
                if (num.length > 10) {
                    num = num.slice(1)
                }
                break;
            case "+1":
                if (num.length > 10) {
                    num = num.slice(1)
                }
                break;
            default:
                break;
        }
        this.setState({
            num: num
        },
            () => {
                this.formatNum()
            }
        )
    }

    formatNum = () => {
        var num = this.state.num
        num = num.replace(/[^0-9]/, '')
        var fnum = this.state.code.slice(1) + num       // slice off country code and concatenate code and num
        this.setState({
            num: num,
            formattedNum: fnum
        },
            () => {
                this.validateNum()
            }
        )
    }
    
    validateNum = () => {
        var num = this.state.num
        var valid
        switch (this.state.code) {
            case "+44": {
                valid = num.length >= 10
            }
            case "+1": {
                valid = num.length >= 10
            } 
            default:
                break;
        }
        this.setState({
            valid: valid
        },
            () => {
                console.log('validated:', num)
                console.log('formatted num:', this.state.formattedNum)
                this.props.onChange(this.state.formattedNum, this.state.valid)
            }
        )
    }

    onCountryChange = (code) => {
        this.setState({code: code},
            () => {
                this.formatNum()
            }
        )
        this.toggleDropdown()
    }

    render() {
        return (
            <React.Fragment>
                <div className="text-response tel-field">
                    <div className="tel-code" onClick={this.toggleDropdown}>
                        {this.state.code}
                        <img src={dropdownArrow} alt="" className="dropdownArrow" />
                    </div>
                    <input className="tel-input" placeholder={this.format('0123456789')} value={this.state.num == '' ? null : this.state.num} onChange={this.onNumChange}/>
                    <div className="country-dropdown" style={this.state.dropdownOpen ? {position: "absolute"} : {display: "none"}}>
                        {this.countries}
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default TelephoneInput;

class CountryCode extends Component {

    getCode = () => {
        this.props.onClick(this.props.code)
    }

    render() {
        return (
            <div className="country-block" onClick={this.getCode}>
                <img src='UK.png' alt="" />
                <div className="country-name">
                    {this.props.country}
                </div>
                <div className="country-code">
                    {this.props.code}
                </div>
            </div>
        )
    }
}

