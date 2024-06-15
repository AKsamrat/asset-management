import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const CHeckoutForm = ({ id: values }) => {
  const [error, setError] = useState();
  const [clientSecret, setClientSecret] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const { user } = useAuth();
  const stripe = useStripe();
  const navigate = useNavigate();

  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const value = parseInt(values);

  useEffect(() => {
    if (value > 0) {
      axiosSecure.post('/create-payment-intent', { price: value }).then(res => {
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      });
    }
  }, [axiosSecure, value]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('payment error');
      setError(error.message);
    } else {
      console.log('payment method', paymentMethod);
      setError(' ');
    }
    //confirm payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || 'anonymous',
            name: user?.displayName || 'anonymous',
          },
        },
      });
    if (confirmError) {
      console.log('confirmError');
    } else {
      console.log('paymentintent', paymentIntent);
      if (paymentIntent.status === 'succeeded') {
        console.log('Transaction id,', paymentIntent.id);
        setTransactionId(paymentIntent.id);
        //now save the payment in data base
        const payment = {
          email: user?.email,
          price: parseInt(value),
          transactionId: paymentIntent.id,
          date: new Date(), //utc date convert.use moment js to
          employee: parseInt(
            `${value === 5 ? 5 : value === 8 ? 10 : value === 15 ? 20 : 0}`
          ),
          status: 'success',
        };
        const res = await axiosSecure.post('/payments', payment);
        console.log(res.data);
        if (res.data?.insertedId) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Thanks for Your Payment${value}$`,
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/');
        }
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="p-20">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        className="btn btn-sm btn-primary my-4"
        type="submit"
        disabled={!stripe || !clientSecret}
      >
        Pay
      </button>
      <p className="text-red-600">{error}</p>
      {transactionId && (
        <p className="text-green-500">Your transaction Id :{transactionId}</p>
      )}
    </form>
  );
};

export default CHeckoutForm;
