import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card, Divider} from 'antd'
import CompanyInfo from './CompanyInfo';
import TransactionInfo from './TransactionInfo';

class DetailsCard extends Component {
    state = { loading: true }
    render() {
        const {transaction, details} = this.props;
        const title = <div>
                Transaction Details
                <Divider type='vertical' />
                <small>{transaction.date}</small>
            </div>;

        return <Card id='details'
                title={title}
                style={{ width: '100%' }}>
                    <TransactionInfo {...transaction} />
                    {details
                    ? <CompanyInfo {...details} />
                    : <h2 id="company_details">No info for this company</h2>}
                </Card>;
    }
}
DetailsCard.propTypes = {
    transaction: PropTypes.object.isRequired,
    details: PropTypes.object
}
export default DetailsCard;