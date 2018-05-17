import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TransactionListItem from './TransactionListItem'
import {List} from 'antd'

class TransactionList extends Component {
    render() {
        const {transactions, onShowDetails} = this.props;
        return (<div>
            <h1>Total transactions: {transactions.length}</h1>
            <List bordered dataSource={transactions}
                header="Transactions"
                renderItem={item =>  <TransactionListItem {...item} onClick={onShowDetails} /> }>
            </List>
            </div>);
    }
}

TransactionList.propTypes = {
    transactions: PropTypes.array.isRequired,
    onShowDetails: PropTypes.func
}
export default TransactionList;