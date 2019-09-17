import React, { Component } from "react"
import { connect } from "react-redux"
import { makeGetRequest } from "../api_calls";
import Loading from "../general/Loading"

class StylistStats extends Component {
    constructor(props) {
        super(props)
        this.state = {recs: null}
    }

    componentDidMount = () => {
    }

    render() {
        return (
            <div className="panel">
                <div className="medium">
                    Stats 
                </div>
                {
                    this.props.recs.length > 0 ?
                    <>
                    <div className="stat">
                        # recommendations made: {this.props.recs.length}
                    </div>
                    <div className="stat">
                        Items tried on: {this.props.recs.filter((rec)=>{return rec.status != 'recommended'}).length}
                    </div>
                    {/* <div className="stat">
                        Items purchased: {this.props.recs.filter((rec)=>{return rec.status != 'purchased'}).length}
                    </div> */}
                    </>
                    :
                    <Loading />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        recs: state.recs
    }
}

export default StylistStats = connect(mapStateToProps)(StylistStats)