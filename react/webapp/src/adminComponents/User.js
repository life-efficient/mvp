
import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import queryString from "query-string"
import SlideUpPanel from "../components/SlideUpPanel"
import { connect } from "react-redux"
import MakeRecommendations from "./MakeRecommendations"
import UserInfo from "./UserInfo"
import PotentialRecommendation from "../stylistComponents/PotentialRecommendation"
import { withRouter } from "react-router-dom"
import Messaging from "../stylistComponents/Messaging"
import AddRecItem from "./MakeRecommendations"
import DelegateToStylist from "./DelegateToStylist"
import Navbar from "./Navbar"

class User extends Component {
    constructor(props){
        super(props)
        var params = queryString.parse(this.props.location.search)
        this.state = {
            user: null,
            user_id: params.sub,
            styles: [],
            brands: [],
            products: [],
            all_options: {
                brands: [],
                styles: [
                    'streetwear',
                    'preppy',
                    'high_end',
                    'italian',
                    'sartorial',
                    'boho',
                    'formal',
                    'sporty',
                    'technical'
                ]
            },
            already_recommended: []
        }
        this.getUserInfo()
        this.getBrands()
        this.getProducts()
        this.getRecommended()
        this.getRecs()
    }

    getRecommended = () => {
        makeGetRequest(`admin-recommendations?user_id=${this.state.user_id}`,
            (data) => {
                data = data.map(
                    (item) => {
                        return item.product_id
                    }
                )
                console.log('ALREADY RECOMMENDED:', data)
                this.setState({already_recommended: data})
            }
        )
    }

    getOptions = (section) => {
        var options = this.state.all_options[section].map(
            (item, idx) => {
                return (
                    <label>
                        <input type="checkbox" name={section} value={item} checked={this.state[section].includes(item)} onChange={this.onRadioChange}/>
                        {item}
                        <br/>
                    </label>
                )
            }
        )
        return options
    }

    getUserInfo = () => {
        makeGetRequest(`admin-user-info?user_id=${this.state.user_id}`,
            (data) => {
                console.log('USER INFO:', data)
                this.setState({user: data},
                    () => {
                        console.log('state:', this.state)
                    }    
                )
                
                if (Object.keys(data).includes('styles')) {       // if any styles have actually been set yet
                    console.log('TAGS:', data.styles)
                    this.setState({styles: data.styles},
                        () => {
                            console.log(this.state.styles)
                        }    
                    )
                }
                if (Object.keys(data).includes('brands')) {       // if any styles have actually been set yet
                    console.log('BRANDS:', data.brands)
                    this.setState({brands: data.brands},
                        () => {
                            console.log(this.state.brands)
                        }    
                    )
                }
            }
        )
    }

    getBrands = () =>{
        console.log('getting brands')
        makeGetRequest('admin-brands',
            (brands) => {
                brands = brands.body
                brands = JSON.parse(brands)
                brands = brands.reduce(
                    (out, brand) => {
                        out = [...out, brand.brand]
                        return out
                    },
                    []
                )
                console.log(brands)
                this.setState({
                    all_options: {
                        ...this.state.all_options,
                        brands
                    }
                },
                    () => {
                        console.log('STATE:', this.state)
                    }
                )
            }
        )
    }

    getProducts = () => {
        console.log('getting products')
        makeGetRequest(`admin-recommendation-prompts?user_id=${this.state.user_id}`,
            (data) => {
                console.log('PRODUCTS:', data)
                this.setState({
                    products: data
                })
            }
        )
    }

    onRadioChange = (e) => {
        console.log('changing radio')
        console.log(e.target.name)
        //e.persist()
        const name = e.target.name
        const key = e.target.value
        const checked = e.target.checked
        var options = this.state[name]
        if (options.includes(e.target.value)) {     // if checked then remove
            options = options.filter(op => {return op != e.target.value})
        }
        else {                                      // if unchecked then append
            options = [...options, e.target.value]
        }
        this.setState({
            [name]: options
        },
            () => {
                console.log(this.state[name])
                makePostRequest(`admin-user-info?user_id=${this.state.user_id}`, {styles: this.state.styles, brands: this.state.brands},
                    () => {
                        console.log('updated user info')
                        this.getProducts()
                    }
                )
            }    
        )
    }

    getRecs = () => {
        makeGetRequest(`admin-recs?user_id=${this.state.user_id}`,
            (recs) => {
                console.log('RECS:', recs)
                recs = recs.map(
                    (item) => {
                        var url = item.product_url ? item.product_url : item.url
                        return (<div>
                            <img src={item.img_urls[0]} className="liked-img"/>
                            {item.idx}
                            <br/>
                            <a href={url}/>{url}
                        </div>
                        )
                    }
                )
                this.setState({recs})
            }
        )
    }

    render () {
        return (
            <>
                <Navbar back={true} />
                    <div className="large">
                        User
                    </div>
                    <button className="btn" onClick={() => {this.props.openSlideUp(<DelegateToStylist assigned_to={this.state.user ? this.state.user.assigned_to : null}/>)}}>
                        Delegate to stylist
                    </button>
                    <UserInfo user={this.state.user}/>
                    <div className="panel">
                        <div className="medium">
                            Recommendations
                        </div>
                        {
                            this.state.recs ?
                            this.state.recs :
                            'None yet'
                        }
                    </div>
                    <Messaging user_id={this.state.user_id}/>
                    {/* <button className="btn small" onClick={() => this.props.openModal(<AddRecItem closeModal={this.props.closeModal} />)}>
                        Recommend a new item!
                    </button>
                    <div className="panel">
                        <div className="medium">
                            Styles
                        </div>
                        {this.getOptions('styles')}       
                    </div>
                    <div className="panel">
                        <div className="medium">
                            Brands recommending from
                        </div>
                        {this.getOptions('brands')}       
                    </div>
                    <div>

                    </div> */}
                        {/* <div className="medium">
                            Potential recommendations
                        </div>
                        <div className="potential-recs">
                            {
                                this.state.products.map(
                                    (product, idx) => {
                                        return <PotentialRecommendation rec={product} key={idx} already_recommended={this.state.already_recommended.includes(product.product_id)} user_id={this.state.user_id} />
                                    }
                                )
                            }
                        </div> */}
                <SlideUpPanel />
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openModal: (content) => {
            console.log('content:', content)
            dispatch({
                type: "OPEN_MODAL",
                content: content
            })
        },
        openSlideUp: (content) => {
            dispatch({
                type: "OPEN_SLIDEUP",
                content: content
            })
        },
        closeModal: () => {
            dispatch({
                type: "CLOSE_MODAL"
            })
        },
        closeSlideUp: () => {
            dispatch({
                type: "CLOSE_SLIDEUP"
            })
        }
    }
}

export default User = connect(null, mapDispatchToProps)(User)