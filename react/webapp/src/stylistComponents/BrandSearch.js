import React, { Component } from "react"
import { makeGetRequest, makePostRequest } from "../api_calls"
import PotentialRecommendation from "./PotentialRecommendation"
import queryString from "query-string"
import { connect } from "react-redux"
import sendIcon from "../images/icons/send.svg"
import Loading from "../general/Loading"

class ProductSearch extends Component {
    constructor(props) {
        super(props)
        var params = queryString.parse(window.location.search)
        this.state = {
            user_id: params.sub,
            products: [],
            brands: [],
            all_options: {
                brands: []
            },
            brand_request: ''
        }
        this.getBrands()
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
                var checked = this.state[section].includes(item)
                return (
                    <label for={item} className=" tag" style={checked ? {opacity: 1} : {opacity: 0.5}}>
                        <input id={item} className="radio_btn" type="checkbox" value={item} name={section} checked={checked} onChange={this.onRadioChange}/>
                        {item.replace(/_/g, ' ')}
                        <br/>
                    </label>
                )
            }
        )
        return options
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
                brands.sort()
                console.log('THE BRANDS:', brands)
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
        // makeGetRequest(`admin-recommendation-prompts?user_id=${this.state.user_id}`,
        //     (data) => {
        //         console.log('PRODUCTS:', data)
        //         this.setState({
        //             products: data
        //         })
        //     }
        // )
        makePostRequest(`admin-recommendation-prompts?user_id=${this.state.user_id}`, this.state,
            (data) => {
                data = data.json()//body
                .then(
                    (data) =>{
                        console.log('some PRODUCTS:', data)
                        this.setState({
                            products: data
                        })
                    }
                )
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
                this.getProducts()
                console.log(this.state[name])
                // makePostRequest(`admin-user-info?user_id=${this.state.user_id}`, {styles: this.state.styles, brands: this.state.brands},
                //     () => {
                //         console.log('updated user info')
                //         this.getProducts()
                //     }
                // )
            }    
        )
    }

    handleRequestChange = (e) => {
        this.setState({brand_request: e.target.value},
            () => {console.log(this.state)}    
        )
    }

    submitRequest = () => {
        makePostRequest('feature-request', {type: 'new brand request', request: this.state.brand_request},
            () => {
                console.log('brand requested')
                this.setState({brand_request: ''})
            }
        )
    }

    render() {
        return (
            <>
            <div className="panel">
                <div className="medium">
                    Recommend products I've found already
                </div>
                <div className="small">
                    I've found all the products from these brands so you don't have to upload them!
                </div>
                <br/>
                <div className="tags">
                    {this.getOptions('brands')}       
                </div>
                <br/>
                <br/>
                <div>
                    <div><strong>Want a brand that's not here?</strong></div>
                    <div className="searchbar">
                        <input value={this.state.brand_request} onChange={this.handleRequestChange} className="text-response" placeholder='Enter the brand here...' style={{fontSize: '13px'}} />
                        <button onClick={this.submitRequest}>
                            {
                                this.state.request_loading ?
                                <Loading />
                                :
                                <img src={sendIcon} style={{height: '30px'}} />
                            }
                        </button>
                    </div>
                </div>
            </div>
            <div className="potential-recs">
                {
                    this.state.products.map(
                        (product, idx) => {
                            return <PotentialRecommendation rec={product} key={idx} user_id={this.state.user_id} getRecommended={this.props.getRecommended}/>
                            // return <PotentialRecommendation rec={product} key={idx} already_recommended={this.state.already_recommended.includes(product.product_id)} user_id={this.state.user_id} />
                        }
                    )
                }
            </div>
            </>
        )
    }
}

export default ProductSearch