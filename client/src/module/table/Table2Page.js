import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Col, Row, DatePicker, Button, Input, Icon, Divider, Tabs, Table} from 'antd';
import request from 'superagent';

const TabPane = Tabs.TabPane;
const columnsA = [{
    title: '时间',
    dataIndex: 'date'
}, {
    title: '书名',
    dataIndex: 'bookName'
}, {
    title: '价格',
    dataIndex: 'price'
}, {
    title: '数量',
    dataIndex: 'count'
}, {
    title: '洋码',
    dataIndex: 'maYang'
}], columnsB = [
    {
        title: '书名',
        dataIndex: 'bookName'
    }, {
        title: '价格',
        dataIndex: 'price'
    }, {
        title: '数量',
        dataIndex: 'count'
    }, {
        title: '洋码',
        dataIndex: 'maYang'
    }, {
        title: '类型',
        dataIndex: 'type'
    }, {
        title: '业务类型',
        dataIndex: 'businessType'
    }, {
        title: '90天同比',
        dataIndex: 'countFor90'
    }, {
        title: '180天同比',
        dataIndex: 'countFor180'
    }, {
        title: '360天同比',
        dataIndex: 'countFor360'
    }, {
        title: '增长',
        dataIndex: 'increase'
    }, {
        title: '时间段',
        dataIndex: 'dateRange'
    }
], columnsC = [
    {
        title: '类型',
        dataIndex: 'type'
    }, {
        title: '数量',
        dataIndex: 'count'
    }, {
        title: '洋码',
        dataIndex: 'maYang'
    }, {
        title: '180天同比',
        dataIndex: 'countFor180'
    }, {
        title: '360天同比',
        dataIndex: 'countFor360'
    }, {
        title: '增长',
        dataIndex: 'increase'
    }, {
        title: 'proportion',
        dataIndex: 'proportion'
    }
]

const dataA = [{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "16",
    "count": 0,
    "maYang": 287200.0
}], dataB = [
    {
        "bookName": "山东 语文读本 六年级上册",
        "price": null,
        "count": 1,
        "maYang": 287200.0,
        "type": null,
        "businessType": null,
        "countFor90": 1,
        "countFor180": 0,
        "countFor360": 0,
        "increase": "0.0",
        "dateRange": null
    }], dataC1 = [
    {
        "id": 1,
        "type": "test type",
        "count": 1,
        "maYang": 287200.0,
        "countFor180": 1,
        "countFor360": 0,
        "increase": null,
        "proportion": "0.0"
    }], dataC2 = [
    {
        "id": 1,
        "businessType": "test business type",
        "count": 1,
        "maYang": 287200.0,
        "countFor180": 1,
        "countFor360": 0,
        "increase": null,
        "proportion": "0.0"
    }];

class Table2Page extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableA: [],
            tableB: [],
            tableC: [],
        };
    }

    search = () => {
        const {bookName, fromTT, toTT} = this.state;
        // const fromUnixTT = fromTT.unix(), toUnixTT = toTT.unix();

        // request.get("/tableA").then((response) => {
        //     const data = response.body;
        //     this.setState({data});
        //     return request.get("/tableB");
        // }).then((response) => {
        //     const data = response.body;
        //     this.setState({data});
        // }).then( () => {
        //     if (bookName && bookName.length > 0) {
        //         request.get("/tableC")
        //         .end((error, data) => {
        //             this.setState({data});
        //         })
        //     }
        // }).catch(err => {
        //     console.error(err);
        // });
        this.setState({tableA: dataA, tableB: dataB, tableC: dataC1});
    }

    emitEmpty = () => {
        this.bookNameInput.focus();
        this.setState({bookName: ''});
    }
    onChangeUserName = (e) => {
        this.setState({bookName: e.target.value});
    }


    render() {
        const {bookName, fromTT, toTT, tableA, tableB, tableC} = this.state;
        const suffix = bookName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return [
            <h1>
                入库数据
            </h1>,
            <div>
                <Row gutter={4}>
                    <Col span={2}/>
                    <Col span={4}>
                        <label>Start:</label>
                        <DatePicker value={fromTT}
                                    disabledDate={
                                        (current) => {
                                            if (toTT)
                                                return current.isBefore(toTT)
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({fromTT: date});
                        }}/>
                    </Col>
                    <Col span={4}>
                        <label>End:</label>
                        <DatePicker value={toTT}
                                    disabledDate={
                                        (current) => {
                                            if (fromTT)
                                                return current.isAfter(fromTT);
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({toTT: date});
                        }}/>
                    </Col>
                </Row>
                <br/>
                <Row gutter={16}>
                    <Col span={2}/>
                    <Col span={8}>
                        <Input
                            placeholder="Enter book name"
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            suffix={suffix} value={bookName}
                            onChange={this.onChangeUserName}
                            ref={node => this.bookNameInput = node}/>
                    </Col>
                    <Col span={4}>
                        <Button onClick={this.search} type="primary" icon="search">Search</Button>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={20} offset={2}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="desktop"/>表1</span>} key="1">
                                <Table columns={columnsA} dataSource={tableA}/>
                            </TabPane>
                            {tableB.length > 0 &&
                            <TabPane tab={<span><Icon type="line-chart"/>表2</span>} key="2">
                                <Table columns={columnsB} dataSource={tableB}/>
                            </TabPane>
                            }
                            {tableC.length > 0 &&
                            <TabPane tab={<span><Icon type="area-chart"/>表3</span>} key="3">
                                <Table columns={columnsC} dataSource={tableC}/>
                            </TabPane>
                            }
                        </Tabs>
                    </Col>
                </Row>

            </div>
        ];
    }
}

export default Table2Page;