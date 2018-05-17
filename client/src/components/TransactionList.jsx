import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TransactionListItem from './TransactionListItem'
import {List, Button, Icon, Timeline, Row, Col} from 'antd'
import formatColumn from 'accounting-js/lib/formatColumn'

class TransactionList extends Component {
    onClick = (transaction) => {
        if (this.props.onShowDetails) this.props.onShowDetails(transaction);
    }
    render() {
        const {transactions} = this.props;
        const amounts = formatColumn(transactions.map(t => t.amount));

        const items = transactions.map((t, i) => <Timeline.Item key={t.transaction_id}>
                <a onClick={this.onClick.bind(this, t)} className='timeline-item'>
                    <Row>
                        <Col span={4}>
                            <small>{t.date}</small>
                        </Col>
                        <Col span={12}>
                            {t.name}
                        </Col>
                        <Col span={4} style={{verticalAlign: 'middle'}}>
                            <pre style={{margin: 0}}>{amounts[i]}</pre>
                        </Col>
                        <Col span={4}>
                            <Button type='primary' size='small'>Details <Icon type="right-circle-o"/></Button>
                        </Col>
                    </Row>
                </a>
            </Timeline.Item>)
        return <Timeline>{items}</Timeline>
    }
}

TransactionList.propTypes = {
    transactions: PropTypes.array.isRequired,
    onShowDetails: PropTypes.func
}
export default TransactionList;