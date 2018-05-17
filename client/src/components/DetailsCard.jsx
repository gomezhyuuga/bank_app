import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card, Divider} from 'antd'
import CompanyInfo from './CompanyInfo';
import TransactionInfo from './TransactionInfo';

class DetailsCard extends Component {
    state = { loading: true }
    render() {
        const {transaction, details} = this.props;

        return <Card title={<div>Transaction Details <Divider type='vertical' /><small>{transaction.date}</small></div>}
                style={{ width: '100%' }}>
                    <TransactionInfo {...transaction} />
                    {details && <CompanyInfo {...details} />}
                </Card>;
    }
}
DetailsCard.propTypes = {
    transaction: PropTypes.object.isRequired,
    details: PropTypes.object
}
export default DetailsCard;