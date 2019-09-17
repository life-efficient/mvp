import React, { Component } from "react"
import "./Dropdown.css"

class Dropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dropdownOpen: false,
            dropdownOptions: null,
            value: this.props.value
        }
    }


    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClick, false)
        var options = this.props.options.map( 
            (option) => {
                return (
                    <option className="dropdown-option" value={option}>
                        {option}
                    </option>
                )
            }
        )
        this.options = options
    }

    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = (e) => {
        if (this.node.contains(e.target)) {
            this.toggleDropdown()
        }
    }

    toggleDropdown = () => {
        this.setState({dropdownOpen: !this.state.dropdownOpen},
            () => {
                console.log('dropdown open?', this.state.dropdownOpen)
            }
        )
    }

    setValue = (e) => {
        console.log('setting')
        this.setState({value: e.target.id},
            console.log(this.state)
        )
        this.toggleDropdown()
    }

    render() {
        return (
            <div className="dropdown">
                <select ref={node => this.node = node} value={this.props.value ? this.props.value : null} onChange={this.props.onChange} className="text-response extra-detail" name={this.props.name} id={this.props.id}>
                    <option disabled selected>{this.props.prompt}</option>
                    {this.options}
                </select>
                
                {/*<div className="dropdown-options" style={this.state.dropdownOpen ? {position: "absolute"} : {display: "none"}}>
                    {this.options}
                </div>
                */}
            </div>
        )
    }
}

export default Dropdown