import React, {Component} from 'react'
import {Button, List, Tag, Icon} from 'antd'
import PropTypes from 'prop-types'
import formatMoney from 'accounting-js/lib/formatMoney.js'

class TransactionListItem extends Component {
    onClick = () => {
        if (this.props.onClick) this.props.onClick(this.props);
    }
    render() {
        const {transaction_id, name, date, amount, category} = this.props;
        const _more_info = <Button type='primary' onClick={this.onClick}>Details<Icon type="right-circle-o"/></Button>;
        const amount_str = formatMoney(amount);
        const tags       = category.map(a => <Tag key={a}>{a}</Tag>);

        return <List.Item key={`${transaction_id}_${date}`} actions={[date, _more_info]}>
                    <List.Item.Meta title={name} description={tags} />
                    <strong style={{ alignSelf: 'center' }}>{amount_str}</strong>
               </List.Item>;
    }
}

TransactionListItem.propTypes = {
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    onClick: PropTypes.func,
    date: PropTypes.string
}

export default TransactionListItem;