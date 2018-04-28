
import React, { Component } from 'react';
import './App.css'
import logo from './logo.jpg';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import { NavLink } from "react-router-dom";

import {PATH_MAP as paths} from '../common/Constant';

const { Header, Content, Footer } = Layout;
const PathMap = Object.keys(paths);

class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  getPageIndex = () => {
    let index = 0;
    if(this.props.location)
        PathMap.indexOf(this.props.location.pathname);
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
                    <NavLink to={paths.home} activeClassName="active">
                        <Icon type="home" />主页
                    </NavLink>
                </Menu.Item>
                  <Menu.SubMenu title={<span><Icon type="book" />数据查询</span>}>
                      <Menu.Item key="2">
                          <NavLink to={paths.table1} activeClassName="active">
                              <Icon type="table" />生产
                          </NavLink>
                      </Menu.Item>
                      <Menu.Item key="3">
                          <NavLink to={paths.table2} activeClassName="active">
                              <Icon type="table" />入库
                          </NavLink>
                      </Menu.Item>
                      <Menu.Item key="4">
                          <NavLink to={paths.table3} activeClassName="active">
                              <Icon type="table" />销售（发货/退货）
                          </NavLink>
                      </Menu.Item>
                      <Menu.Item key="5">
                          <NavLink to={paths.table4} activeClassName="active">
                              <Icon type="table" />其他出库（样书/调拨）
                          </NavLink>
                      </Menu.Item>
                      <Menu.Item key="6">
                          <NavLink to={paths.table5} activeClassName="active">
                              <Icon type="table" />销账
                          </NavLink>
                      </Menu.Item>
                      <Menu.Item key="7">
                          <NavLink to={paths.table6} activeClassName="active">
                              <Icon type="table" />存货
                          </NavLink>
                      </Menu.Item>
                  </Menu.SubMenu>
                <Menu.Item key="8">
                    <NavLink to={paths.task} activeClassName="active">
                        <Icon type="setting" />设置
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
                {this.props.children}
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <small>图书统计及汇总系统</small>
        </Footer>
      </Layout>
    );
  }
}

export default MainPage;





