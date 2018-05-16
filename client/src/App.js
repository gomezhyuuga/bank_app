import {hot} from 'react-hot-loader'
import React, {Component} from 'react'
import {Layout, Menu} from 'antd'
import { Row, Col } from 'antd';
import axios from 'axios'
import Plaid from './components/Plaid'
import TransactionList from './components/TransactionList'
import './App.css'

const API = axios.create({ baseURL: "http://localhost:4567/api" });

const {Header, Content} = Layout;

class App extends Component {
  state = {
    loggedIn: false,
    public_token: undefined,
    transactions: []
  }

  resetToken = () => {
    sessionStorage.clear();
    this.setState({loggedIn: false, public_token: undefined, transactions: []});
  }
  generateAccessToken = async (public_token) => {
    try {
      const response = await API.post('/get_access_token', {public_token});
      console.log(response)
      return response;
    } catch (error) {
      this.resetToken();
      throw error;
    }
  }
  plaidLogin = (public_token, metadata) => {
    sessionStorage.setItem('public_token', public_token);
    this.setState({public_token, loggedIn: true}, () => {
      this.generateAccessToken(public_token)
        .then(this.getTransactions);
    });
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
    const response = await API.get('/transactions');
    console.log(response);
    const transactions = (response.data && response.data.transactions) || [];
    this.setState({transactions});
  }
  render() {
    return <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item>
            <div>
              <Plaid handleOnSuccess={this.plaidLogin} />
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <h1>Hello world!</h1>
        <Row>
          <Col span={16}>
            {this.state.loggedIn ? <TransactionList transactions={this.state.transactions} /> : <div>You must login</div>}
          </Col>
          <Col span={8}>
            <h1>Transaction information</h1>
          </Col>
        </Row>
      </Content>
    </Layout>
  }
}

export default hot(module)(App)