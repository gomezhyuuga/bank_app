import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Card, Divider, Alert} from 'antd'
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
                    : <div id="company_details">
                        <Alert showIcon message="No company information"
                            description={<p>
                                    We were unable to find details for the company
                                    <strong> {transaction.name}.</strong>
                                </p>}
                            type="info" />
                      </div>}
                </Card>;
    }
}
DetailsCard.propTypes = {
    transaction: PropTypes.object.isRequired,
    details: PropTypes.object
}
export default DetailsCard;