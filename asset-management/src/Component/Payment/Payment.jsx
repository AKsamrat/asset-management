import React from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CHeckoutForm from './CHeckoutForm';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_PaymentGateway_PK);
const Payment = () => {
  const { id } = useParams();
  console.log(id);
  return (
    <div className="pt-20">
      <h1 className="text-center text-4xl font-bold">PAYMENT</h1>
      <p className="text-center">
        Please Complete Your payment To get all functionality Access
      </p>
      <div>
        <Elements stripe={stripePromise}>
          <CHeckoutForm id={id}></CHeckoutForm>
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
