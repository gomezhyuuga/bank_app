import React from 'react'
import PropTypes from 'prop-types'
import {Row, Col, Icon} from 'antd'
import {formatMoney} from 'accounting'
import { formatDistance } from 'date-fns'
const TransactionInfo = (props) => {
    const {date, amount} = props;

    return <Row type='flex' justify='center' id="transaction_details">
                {props.recurring &&
                    <Col span={6} style={{color: '#f5222d'}}>
                        <Icon type="clock-circle-o" className='info-icon' />
                        Recurring
                    </Col>}
                <Col span={8}>
                    <Icon type="calendar" className='info-icon' />
                    <strong>{formatDistance(new Date(date), new Date(), { addSuffix: true })}</strong>
                </Col>
                <Col span={6}>
                    <Icon type="shopping-cart" className='info-icon' />
                    <strong>{formatMoney(amount)}</strong>
                </Col>
            </Row>;
}

TransactionInfo.propTypes = {
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
}

export default TransactionInfo;