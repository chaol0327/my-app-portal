
import React, { Component } from 'react';
import './App.css'
import logo from './logo.jpg';
import hdLogo from './hd_bg.jpg';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { Route, Switch, Link } from "react-router-dom";
import DashboardPage from './dashboard/DashboardPage';
import TablePage from './table/TablePage';
import TaskPage from './task/TaskPage';

import {PATH_MAP as paths} from '../common/Constant';

const { Header, Content, Footer } = Layout;
const PathMap = [paths.main+'/'+paths.home, paths.main+'/'+paths.table, paths.main+'/'+paths.task]

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  getPageIndex = () => {
    // this.props.location.pathname == '/main/dashboard' 
    return 1;
  }

  render() {

    return (
        <Layout className="layout">
        <Header>
          <Row>
            <Col span={6}>
                <img src={logo} alt="logo" />
            </Col>
            <Col span={14}>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.getPageIndex() + ""]} style={{ lineHeight: '64px' }}>
                <Menu.Item key="1">
                <Icon type="mail" />Dashboard
                </Menu.Item>
                <Menu.Item key="2">
                <Icon type="mail" />Table
                </Menu.Item>
                <Menu.Item key="3">
                <Icon type="mail" />Sync Task
                </Menu.Item>
              </Menu>
            </Col>
            {/*<Col span={4}>*/}
              {/*<img src={hdLogo} style={{float: 'right'}}/>*/}
            {/*</Col>*/}
          </Row>
        </Header>
        <Content>
            <div>Content</div>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
              test
              <Switch>
                  <Route path={this.props.match.url+paths.table} component={TablePage}/>
                  <Route path={this.props.match.url+paths.task} component={TaskPage}/>  
                  <Route component={DashboardPage}/>
              </Switch>
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Books Report System
        </Footer>
      </Layout>
    );
  }
}

export default MainPage;




