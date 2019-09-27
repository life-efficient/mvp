import React, { Component } from "react"
import tick from "../../images/icons/tick.png"
import cross from "../../images/icons/cross.png"

class AddOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            new_key: '',
            new_val: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        },
            () => {console.log(this.state)}
        )
    }

    addOption = () => {
        this.props.addOption(this.state.new_key, this.state.new_val)
        this.setState({
            new_key: '',
            new_val: ''
        })
    }

    render() {
        return (
            <div className="field-container">
            <div className="field-title">
                {this.props.title}
            </div>
            <div style={{display: 'flex', marginTop: '10px', width: '100%', maxWidth: '300px'}}>

                {/* KEYS */}
                <div style={{display: 'flex', flexDirection: 'column', marginRight: '10px', width: '30%'}}>
                    <div className="field-title" style={{fontSize: '10px'}}>
                        {this.props.key_name}
                    </div>
                    {
                        Object.keys(this.props.options).map(
                            (k) => {
                                return (
                                    <div style={{marginTop: '10px'}}>
                                        <input className="text-response" value={k}/>
                                    </div>
                                )
                            }
                        )
                    }
                    <input id="new_key" className="text-response" value={this.state.new_key} onChange={this.handleChange} style={{marginTop: '10px'}} />
                </div>

                {/* VALUES */}
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="field-title" style={{fontSize: '10px'}}>
                        {this.props.val_name}
                    </div>
                    {
                        Object.values(this.props.options).map(
                            (v, idx) => {
                                return (
                                    <div style={{display: 'flex', marginTop: '10px'}}>
                                        <input className="text-response" value={v}/>
                                        <button id={Object.keys(this.props.options)[idx]} style={{margin: '0 0 10px 10px'}} onClick={this.props.removeOption}>
                                            <img src={cross} style={{height: '10px'}}/>
                                        </button>
                                    </div>
                                )
                            }
                        )
                    }
                    <div style={{display: 'flex', marginTop: '10px'}}>
                        <input id="new_val" className="text-response" value={this.state.new_val} onChange={this.handleChange} />
                        <button style={{marginLeft: '10px'}} onClick={this.addOption} style={{margin: '0 0 10px 10px'}} >
                            <img src={tick} style={{height: '10px'}}/>
                        </button>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default AddOptions