import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {List, Button, Tag, Icon} from 'antd'
import formatMoney from 'accounting-js/lib/formatMoney.js'

class TransactionList extends Component {
    render() {
        const {transactions} = this.props;
        const _more_info = <Button type='primary'>Details<Icon type="right-circle-o" /></Button>;
        return (<div>
            <h1>Total transactions: {transactions.length}</h1>
            <List
                bordered
                dataSource={transactions}
                header="Transactions"
                renderItem={item => {
                    const {id, name, date, amount} = item;
                    const amount_str = formatMoney(amount);
                    const tags       = item.category.map(a => <Tag>{a}</Tag>)
                    return  <List.Item key={id} actions={[date, _more_info]}>
                                <List.Item.Meta title={name} description={tags}/>
                                <strong style={{alignSelf: 'center' }}>{amount_str}</strong>
                            </List.Item>;
                }}>
            </List>
            </div>
        );
    }
}

TransactionList.propTypes = {
    transactions: PropTypes.array.isRequired
}
export default TransactionList;