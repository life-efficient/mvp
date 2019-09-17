import React, {Component} from "react"
import { makeGetRequest, makePostRequest } from "../api_calls";

class UpdateBrands extends Component {
    constructor(props){
        super(props)
        this.state = {brands: {}, ready: false}
        this.styles = [
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
    }

    componentDidMount = () => {
        console.log('setting brands')
        var brands = {
            'Scotch_and_Soda': {
                styles: [
                    'streetwear',
                    'preppy',
                    'high_end',
                    'italian',
                    'sartorial'
                ]
            },
            'Nordstrom_rack': {
                styles: [
                    'streetwear',
                    'preppy'
                ]
            }
        }
        makeGetRequest('admin-brands',
            (brands) => {
                brands = brands.body
                brands = JSON.parse(brands)
         
                brands = brands.reduce(
                    (out, arr) => {
                        console.log(out)
                        arr = Object.keys(arr).includes('styles') ? arr : {...arr, styles: []}
                        out[arr.brand] = arr
                        return out
                    },
                    {}
                )
                console.log(brands)
                this.setState({
                    brands: brands,
                    current_brand: Object.keys(brands)[0],
                    ready: true
                },
                    () => {
                        console.log('STATE:', this.state)
                    }
                )
            }
        )
    }

    handleChangeBrand = (e) => {
        console.log(e.target)
        this.setState({current_brand: e.target.value}, 
            () => {console.log('selected brand:', this.state.current_brand)}    
        )
    }

    getOptions = (section) => {
        if (this.state.ready) {
            console.log(this.state.current_brand)
            console.log(this.state.brands[this.state.current_brand])
            var options = this.styles.map(
                (item, idx) => {
                    return (
                        <label>
                            <input type="checkbox" name={section} value={item} checked={this.state.brands[this.state.current_brand].styles.includes(item)} onChange={this.handleCheckboxChange}/>
                        {item}
                            <br/>
                        </label>
                    )
                }
            )
            return options
        }
        else {
            console.log('not yet ready')
            return null
        }
    }

    handleCheckboxChange = (e) => {
        console.log('changing selection:', e.target.value)
        var current_brand = this.state.current_brand
        var options = this.state.brands[current_brand].styles       // list of currently selected styles
        if (options.includes(e.target.value)) {     // if checked then remove
            options = options.filter(op => {return op != e.target.value})
        }
        else {                                      // if unchecked then append
            options = [...options, e.target.value]
        }
        console.log('current ops:', options)
        this.setState({
            brands:
                {
                    ...this.state.brands,
                    [current_brand]: {
                        ...this.state.brands[current_brand],
                        styles: options
                    }
                }
        },
            () => {
                console.log(this.state.brands[current_brand].styles)
                makePostRequest('admin-brands', 
                    {
                        brand: current_brand, 
                        styles: this.state.brands[current_brand].styles
                    },
                    () => {
                        console.log('brand updated')
                    }
                )
            }
        )
    }

    render() {
        return (
            <div className="body">
                <div className="panel">
                    <div className="large">
                        Brands
                    </div>
                    <select onChange={this.handleChangeBrand} value={this.state.current_brand}>
                        {
                            Object.keys(this.state.brands).map(
                                (item) => {return <option value={item}>{item}</option>}
                            )
                        }
                    </select>
                    <div className="medium">
                        Styles
                    </div>
                    {this.getOptions('styles')}       
                </div>
            </div>
        )
    }

}

export default UpdateBrands