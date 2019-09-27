import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import {Elements, StripeProvider} from 'react-stripe-elements';
import "./Payment.css"
import Navbar from './Navbar';
// const stripe = window.Stripe('pk_test_98UmCoevgIbIlIhQ23DgfoPq00nJOgxucq');
const stripe = window.Stripe('pk_live_6QBiN2gcJ1SLqHxNP8hFsb6o00Bg8ug9gi');

export default class Payment extends Component {

  redirectToCheckout = () => {
    stripe.redirectToCheckout({ 
      items: [{plan: 'plan_FqoUfSsLWXasp2', quantity: 1}],
      // items: [{plan: 'plan_FqndfuSZmDJnCZ', quantity: 1}],
      // Do not rely on the redirect to the successUrl for fulfilling
      // purchases, customers may not always reach the success_url after
      // a successful payment.
      // Instead use one of the strategies described in
      // https://stripe.com/docs/payments/checkout/fulfillment
      // successUrl: 'https://supermedia.io.s3-website-eu-west-1.amazonaws.com',
      successUrl: 'https://supermedia.io/payment_confirmed',
      cancelUrl: 'https://supermedia.io/payment_failed',
    })
    .then(function (result) {
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        var displayError = document.getElementById('error-message');
        displayError.textContent = result.error.message;
      }
    });
  }

  render() {
    return (
      <>
      <Navbar />
      <div className="body">

        <div className="panel">
          <button onClick={this.redirectToCheckout}>
            Checkout
          </button>
        </div>
      </div>
      </>
      // <StripeProvider apiKey="pk_test_98UmCoevgIbIlIhQ23DgfoPq00nJOgxucq">
      //   <div className="example">
      //     <h1>React Stripe Elements Example</h1>
      //     <Elements>
      //       <CheckoutForm />
      //     </Elements>
      //   </div>
      // </StripeProvider>
    );
  }
}

// const createOptions = () => {
//   return {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         fontFamily: 'Open Sans, sans-serif',
//         letterSpacing: '0.05em',
//         '::placeholder': {
//           color: '#aab7c4',
//         },
//       },
//       invalid: {
//         color: '#c23d4b',
//       },
//     }
//   }
// };

// class _CheckoutForm extends Component {
//   constructor(props) {
//     super(props);

//     this.submit = this.submit.bind(this);
//   }

//   async submit(ev) {
//     let {token} = await this.props.stripe.createToken({name: "Name"});
//     let response = await fetch("/charge", {
//       method: "POST",
//       headers: {"Content-Type": "text/plain"},
//       body: token.id
//     });
  
//     if (response.ok) console.log("Purchase Complete!")
//   }

//   render() {
//     if (this.state.complete) {console.log('purchase complete')}

//     return (
//       <div className="checkout panel">
//         <p>Would you like to complete the purchase?</p>
//         <CardElement />
//         <button onClick={this.submit}>Purchase</button>
//       </div>
//     );
//   }
// }

// var CheckoutForm = injectStripe(_CheckoutForm);

export const PaymentConfirmed = () => {
    return (
        <div className="panel">
            <div className="title">
                Payment confirmed 
            </div>
        </div>
    )
}

export const PaymentFailed = () => {
    return (
        <div className="panel">
            <div className="title">
                Payment failed
            </div>
        </div>
    )
}

 