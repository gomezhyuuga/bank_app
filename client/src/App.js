import {hot} from 'react-hot-loader'
import React, {Component} from 'react'
import {Layout, Menu} from 'antd'
import { Row, Col } from 'antd';
import Plaid from './components/Plaid'
import TransactionList from './components/TransactionList'
import './App.css'
import DetailsCard from './components/DetailsCard';

const {Header, Content, Sider} = Layout;

class App extends Component {
  state = {
    loggedIn: false,
    public_token: undefined,
    details: undefined,
    selectedTransaction: undefined,
    transactions: []
  }

  resetToken = () => {
    sessionStorage.clear();
    this.setState({loggedIn: false, public_token: undefined, transactions: []});
  }
  generateAccessToken = async (public_token) => {
    try {
      const response = await fetch('/get_access_token', { method: 'POST', body: {public_token}});
      sessionStorage.setItem('public_token', public_token);
      console.log(response)
      return response;
    } catch (error) {
      this.resetToken();
      throw error;
    }
  }
  plaidLogin = (public_token, metadata) => {
    this.setState({public_token, loggedIn: true}, () => {
      this.generateAccessToken(public_token)
        .then(this.getTransactions);
    });
  }
  showDetails = (transaction) => {
    const company = transaction.name;

    fetch(`/companies/${company}`)
      .then( async (response) => {
        const data = await response.json();
        console.log("Transaction", transaction);
        console.log("Details", data);

        this.setState({
          selectedTransaction: transaction,
          details: data
        });
      }).catch(error => this.setState({selectedTransaction: transaction, details: null}));
  }
  componentDidMount() {
    const public_token = sessionStorage.getItem('public_token');

    console.log("PUBLIC TOKEN", public_token);
    if (public_token) this.setState({public_token, loggedIn: true}, () => {
      this.generateAccessToken(public_token)
        .then(this.getTransactions);
    });
  }

  getTransactions = async() => {
    const response = await fetch('/transactions');
    const transactions = (await response.json()) || [];
    console.log(transactions);
    this.setState({transactions});
  }
  render() {
    const {selectedTransaction, details} = this.state;

    return <Layout>
      <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item>
            <div>
              <Plaid handleOnSuccess={this.plaidLogin} />
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ padding: 24, minHeight: 280 }}>
          <Row gutter={16}>
            <Col span={12}>
              {this.state.loggedIn
                ? <TransactionList id='transaction_list' transactions={this.state.transactions} onShowDetails={this.showDetails} />
                : <div>You must login</div>}
            </Col>
          </Row>
        </div>
      </Content>
      </Layout>
      <Sider breakpoint='md' collapsedWidth={520} width='50%' style={{ overflow: 'auto', padding: '64px 24px', height: '100vh', position: 'fixed', right: 0 }}>
              {selectedTransaction && <DetailsCard id='details' transaction={selectedTransaction} details={details} />}
        </Sider>
    </Layout>
  }
}

export default hot(module)(App)