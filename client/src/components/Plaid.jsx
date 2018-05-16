import React from 'react'
import PlaidLink from 'react-plaid-link'

const PUBLIC_KEY = "59a8fa31d49b1271a3f4cf0303d30f";

const Plaid = ({handleOnSuccess, handleOnExit}) => (
    <PlaidLink
        clientName="Clearbit Interview"
        className="primary large"
        style={{
            background: 'none',
            border: 'none',
            height: 'auto'
        }}
        env="sandbox"
        product={["auth", "transactions"]}
        publicKey={PUBLIC_KEY}
        onExit={handleOnExit}
        onSuccess={handleOnSuccess}>
        Select your bank
    </PlaidLink>);

export default Plaid;