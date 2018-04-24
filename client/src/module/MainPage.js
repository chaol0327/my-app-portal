
import React, { Component } from 'react';
import './App.css'
import logo from './logo.jpg';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { Route, Switch, NavLink } from "react-router-dom";
import DashboardPage from './dashboard/DashboardPage';
import TablePage from './table/TablePage';
import TaskPage from './task/TaskPage';

import {PATH_MAP as paths} from '../common/Constant';

const { Header, Content, Footer } = Layout;
const PathMap = [paths.main+paths.home, paths.main+paths.table, paths.main+paths.task]

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  getPageIndex = () => {
    let index = PathMap.indexOf(this.props.location.pathname);
    return index > 0 ? index+1 : 1;
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
                    <NavLink to="/main/home" activeClassName="active">
                        <Icon type="mail" />Dashboard
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to="/main/table" activeClassName="active">
                        <Icon type="mail" />Table
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to="/main/task" activeClassName="active">
                        <Icon type="mail" />Sync Task
                    </NavLink>
                </Menu.Item>
              </Menu>
            </Col>
            {/*<Col span={4}>*/}
              {/*<img src={hdLogo} style={{float: 'right'}}/>*/}
            {/*</Col>*/}
          </Row>
        </Header>
        <Content>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
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





