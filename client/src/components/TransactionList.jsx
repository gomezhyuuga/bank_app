import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Icon, Timeline, Row, Col} from 'antd'
import {formatColumn} from 'accounting'
import { format } from 'date-fns'

class TransactionList extends Component {
    onClick(transaction) {
        if (this.props.onShowDetails) this.props.onShowDetails(transaction);
    }
    _build_items(transactions) {
        return transactions.map((t, i) => {
            let options = { color: 'blue' }
            if (t.recurring) {
                options.color = 'red';
                options.dot   = <Icon type='clock-circle-o' />;
            }
            if (t.amount < 0) options.color = 'green';
            return <Timeline.Item style={{background: 'none'}} key={t.transaction_id} {...options}>
                    <a onClick={this.onClick.bind(this, t)} className='timeline-item'>
                        <Row>
                            <Col span={4}><small>{t.date}</small></Col>
                            <Col span={12}>{t.name}</Col>
                            <Col span={4} style={{verticalAlign: 'middle'}}>
                                <pre style={{margin: 0}}>{t.amount_str}</pre>
                            </Col>
                            <Col span={4}>
                                <Button type='primary' size='small'>Details <Icon type="right-circle-o"/></Button>
                            </Col>
                        </Row>
                    </a>
                </Timeline.Item>;
        });
    }
    _loadMore = () => {
        console.log('Loading more transactions');
        if (this.props.onLoadMore) this.props.onLoadMore();
    }
    render() {
        const {transactions} = this.props;
        const columns = formatColumn(transactions.map(t => t.amount));
        columns.forEach((val, i) => transactions[i].amount_str = val);

        const items = _(transactions)
                        .groupBy('date')
                        .map( (lst, date) => {
            const date_header = <Timeline.Item className='timeline-header'
                                    dot={<Icon type='calendar' />}>
                                        {format(date, 'PPPP')}
                                    </Timeline.Item>;
            return [date_header, ...this._build_items(lst)];
        }).value();

        return  <React.Fragment>
                    <h2>Transactions <small>({transactions.length})</small></h2>
                    <Timeline id='transaction_list'>{items}</Timeline>
                    <div style={{textAlign: 'center' }}>
                        <Button loading={this.props.loading} onClick={this._loadMore}>Load more</Button>
                    </div>
                </React.Fragment>
    }
}

TransactionList.propTypes = {
    transactions: PropTypes.array.isRequired,
    onShowDetails: PropTypes.func,
    loading: PropTypes.bool,
    onLoadMore: PropTypes.func
}
export default TransactionList;