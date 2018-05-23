import {hot} from 'react-hot-loader'
import React, {Component} from 'react'
import {Spin, Layout, Alert, message, Divider, Icon} from 'antd'
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
    count: 10,
    loading: true,
    transactions: []
  }

  resetToken = () => {
    sessionStorage.clear();
    this.setState({loggedIn: false, public_token: undefined, transactions: []});
  }
  generateAccessToken = async (public_token) => {
    try {
      console.log("PUBLIC TOKEN", public_token)
      const response = await fetch('/get_access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({public_token})
      });
      if (response.status !== 200) throw response;
      sessionStorage.setItem('public_token', public_token);
      message.success("Sucessfully logged in.")
      return response;
    } catch (error) {
      this.resetToken();
      message.error("Error while logging in.")
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

        this.setState({
          selectedTransaction: transaction,
          details: data
        });
      }).catch(error => this.setState({selectedTransaction: transaction, details: null}));
  }
  componentDidMount() {
    const public_token = sessionStorage.getItem('public_token');

    if (public_token) this.setState({public_token, loggedIn: true}, () => {
      this.generateAccessToken(public_token)
        .then(this.getTransactions);
    });
  }

  getTransactions = async () => {
    const offset   = this.state.transactions.length;
    const count    = this.state.count;
    const response = await fetch(`/transactions?offset=${offset}&count=${count}`);
    try {
      const transactions = (await response.json()) || [];
      this.setState({
        transactions: [...this.state.transactions, ...transactions],
        loading: false
      });
    } catch (error) { }
  }
  render() {
    const {selectedTransaction, details, loading, loggedIn} = this.state;

    let content = <div>
      <Alert
        message="Unauthenticated"
        description={<div>
          You must login to use the application.
          <Plaid handleOnSuccess={this.plaidLogin} />
          </div>}
        type="warning"
        showIcon
      />
    </div>;
    if (loggedIn && loading) {
      content = <Spin spinning={loading} id='loading' tip='Loading transactions...' size='large' />;
    } else if (loggedIn && !loading) {
      content = <TransactionList
          transactions={this.state.transactions}
          onLoadMore={this.getTransactions}
          onShowDetails={this.showDetails} />;
    }

    return <Layout>
      <Layout>
        <Header id='header'>
            <h2>Bank Account Transactions</h2>
            <Divider type='vertical' />
            <a href="summary.pdf">
              <Icon type='cloud-download' className='header-icon' />
              Summary
            </a>
            <Divider type='vertical' />
            <a href="docs/">
              <Icon type='copy' className='header-icon' />
              Docs
            </a>
            <Divider type='vertical' />
            <a href="https://gomezhyuuuga.github.io/">
              &copy; 2018 - Fernando Gómez Herrera
            </a>
        </Header>
        <Content style={{ padding: '0px 50px', marginRight: '50%', marginTop: 64 }}>
          <div className='content'>
            {content}
          </div>
        </Content>
      </Layout>
      <Sider className='app-sidebar' breakpoint='md' collapsedWidth={400} width='50%'>
        {selectedTransaction && <DetailsCard transaction={selectedTransaction} details={details} />}
      </Sider>
    </Layout>
  }
}

export default hot(module)(App)