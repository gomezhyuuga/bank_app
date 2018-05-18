import React from 'react'
import {Icon} from 'antd'
import PlaidLink from 'react-plaid-link'

const PUBLIC_KEY = "59a8fa31d49b1271a3f4cf0303d30f";

const Plaid = ({handleOnSuccess, handleOnExit}) => (
    <PlaidLink
        clientName="Clearbit Interview"
        className="ant-btn ant-btn-primary ant-btn-lg"
        style={{
            backgroundColor: '#1890ff',
        }}
        env="sandbox"
        product={["auth", "transactions"]}
        publicKey={PUBLIC_KEY}
        onExit={handleOnExit}
        onSuccess={handleOnSuccess}>
        <Icon style={{marginRight: 8}} type='login' />
        Select your bank
    </PlaidLink>);

export default Plaid;