import React, { Component } from "react"
import LineChart from "../components/Chart"
import Navbar from "../landingComponents/Navbar";

class Charts extends Component{
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }
    componentDidMount = () => {
        fetch('https://dihwh38uwi.execute-api.eu-west-2.amazonaws.com/prod/data')
        .then(
            data => {
                // console.log(data)
                data = data.json()
                // console.log(data)
                return data
            }
        )
        .then(
            data => {
                data = data.body
                data = JSON.parse(data)
                data = JSON.parse(data)
                this.setState({data})
            }
        )
    }

    render() {
        return (
            <>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {/* //, backgroundColor: 'black', height: '100vh'}}> */}
                {
                    this.state.data!=null ?
                        ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'].map(
                            (d, idx) => {
                                return (<LineChart title={d} data={this.state.data[d]} idx={idx}/>)
                            }
                        )
                    :
                    null
                }
            </div>
           </>
        )
    }
}

export default Charts