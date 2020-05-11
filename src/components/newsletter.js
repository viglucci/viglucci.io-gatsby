import React, { useState } from 'react';
import addToMailchimp from 'gatsby-plugin-mailchimp';

const isAlreadySubscribed = (errorMessage) => {
  return errorMessage.includes('is already subscribed');
};

const SuccessAlert = ({
  text
}) => {
  return (
    <div className="rounded-md bg-green-50 p-4 w-full">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm leading-5 font-medium text-green-800">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('PENDING');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { result, msg } = await addToMailchimp(email);
      if (result === 'error' && isAlreadySubscribed(msg)) {
        setState('ALREADY_SUBSCRIBED');
      } else {
        setState('SUCCESS');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit} className="sm:flex">
      {state === 'PENDING' && (
        <>
          <input
            onChange={handleEmailChange}
            aria-label="Email address"
            type="email"
            required
            className="appearance-none w-full px-5 py-3 border border-transparent text-base leading-6 rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition duration-150 ease-in-out sm:max-w-xs" placeholder="Enter your email" />
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
            <button className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:bg-indigo-400 transition duration-150 ease-in-out">
                Notify me
            </button>
          </div>
        </>
      )}
      {(state === 'ALREADY_SUBSCRIBED' || state === 'SUCCESS') && (
        <SuccessAlert text={"You're all set!"} />
      )}
    </form>
  );
};

const Newsletter = () => {
  return (
    <div className="bg-gray-800">
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-10">
            Sign up for my newsletter
          </h2>
          <p className="mt-3 max-w-3xl text-lg leading-6 text-gray-300">
            Sign up for my newsletter and recieve updates about new articles and other happenings.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
