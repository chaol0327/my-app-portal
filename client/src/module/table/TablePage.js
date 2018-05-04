import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Col, Row, DatePicker, Button, Input, Icon, Divider, Tabs, Table} from 'antd';
import request from 'superagent';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const columnsA = [{
    title: '时间',
    dataIndex: 'date',
    sorter: (a, b) => a.date - b.date,
    render: (text, row, index) => {
        return moment(text).format("YYYY-MM-DD");
    }
}, {
    title: '书名',
    dataIndex: 'bookName'
}, {
    title: '价格',
    dataIndex: 'price',
        sorter: (a, b) => a.price - b.price,
}, {
    title: '数量',
    dataIndex: 'count',
        sorter: (a, b) => a.count - b.count,
}, {
    title: '码洋',
    dataIndex: 'maYang',
        sorter: (a, b) => a.maYang - b.maYang,
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
    }],
    columnsD = [
        {
            title: '业务类型',
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
];

const dataA = [{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "16",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 2,
    "date": 1533763200000,
    "bookName": "山东 英语读本 一年级上册",
    "price": "21",
    "count": 0,
    "maYang": 127200.0
},{
    "id": 1,
    "date": 1521113200000,
    "bookName": "山东 语文读本 三年级上册",
    "price": "31",
    "count": 0,
    "maYang": 333200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "47",
    "count": 0,
    "maYang": 255500.0
},{
    "id": 1,
    "date": 1521123400000,
    "bookName": "广西 语文读本 三年级上册",
    "price": "89",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "16",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 2,
    "date": 1533763200000,
    "bookName": "山东 英语读本 一年级上册",
    "price": "21",
    "count": 0,
    "maYang": 127200.0
},{
    "id": 1,
    "date": 1521113200000,
    "bookName": "山东 语文读本 三年级上册",
    "price": "31",
    "count": 0,
    "maYang": 333200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "47",
    "count": 0,
    "maYang": 255500.0
},{
    "id": 1,
    "date": 1521123400000,
    "bookName": "广西 语文读本 三年级上册",
    "price": "89",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "16",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 2,
    "date": 1533763200000,
    "bookName": "山东 英语读本 一年级上册",
    "price": "21",
    "count": 0,
    "maYang": 127200.0
},{
    "id": 1,
    "date": 1521113200000,
    "bookName": "山东 语文读本 三年级上册",
    "price": "31",
    "count": 0,
    "maYang": 333200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "47",
    "count": 0,
    "maYang": 255500.0
},{
    "id": 1,
    "date": 1521123400000,
    "bookName": "广西 语文读本 三年级上册",
    "price": "89",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "16",
    "count": 0,
    "maYang": 287200.0
},{
    "id": 2,
    "date": 1533763200000,
    "bookName": "山东 英语读本 一年级上册",
    "price": "21",
    "count": 0,
    "maYang": 127200.0
},{
    "id": 1,
    "date": 1521113200000,
    "bookName": "山东 语文读本 三年级上册",
    "price": "31",
    "count": 0,
    "maYang": 333200.0
},{
    "id": 1,
    "date": 1521763200000,
    "bookName": "山东 语文读本 六年级上册",
    "price": "47",
    "count": 0,
    "maYang": 255500.0
},{
    "id": 1,
    "date": 1521123400000,
    "bookName": "广西 语文读本 三年级上册",
    "price": "89",
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
        "countFor90": 18,
        "countFor180": 36,
        "countFor360": 99,
        "increase": "0.0",
        "dateRange": null
    },{
        "bookName": "新时代 学习系列 第一册",
        "price": null,
        "count": 1,
        "maYang": 257200.0,
        "type": null,
        "businessType": null,
        "countFor90": "-",
        "countFor180": "-",
        "countFor360": "-",
        "increase": "6.0",
        "dateRange": null
    },{
        "bookName": "四川 语文读本 一年级",
        "price": null,
        "count": 1,
        "maYang": 287200.0,
        "type": null,
        "businessType": null,
        "countFor90": 66,
        "countFor180": 9,
        "countFor360": 233,
        "increase": "66.0",
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



const tableConfig1={

},tableConfig2={
    pagination: 'none',
}


class TablePage extends Component {

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
                生产数据
            </h1>,
            <div>
                <Row gutter={6}>
                    <Col span={4} offset={1}>
                        <DatePicker value={fromTT} placeholder="请选择起始日期"
                                    disabledDate={
                                        (current) => {
                                            if (current && toTT)
                                                return current.isSameOrAfter(toTT)
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({fromTT: date});
                        }}/>
                    </Col>
                    <Col span={4}>
                        <DatePicker value={toTT} placeholder="请选择结束日期"
                                    disabledDate={
                                        (current) => {
                                            if (current && fromTT)
                                                return current.isSameOrBefore(fromTT);
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({toTT: date});
                        }}/>
                    </Col>
                    <Col span={6}>
                        <Input
                            placeholder="请输入书名"
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            suffix={suffix} value={bookName}
                            onChange={this.onChangeUserName}
                            ref={node => this.bookNameInput = node}/>
                    </Col>
                    <Col span={2} push={2}>
                        <Button onClick={this.search} type="primary" icon="search">查询</Button>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={22} offset={1}>
                        <Tabs defaultActiveKey="1" tabBarExtraContent={<Button type="primary" icon="export">导出</Button>}>
                            <TabPane tab={<span><Icon type="desktop"/>原始数据明细表</span>} key="1">
                                <Table size="middle" columns={columnsA} dataSource={tableA}/>
                            </TabPane>
                            {tableB.length > 0 &&
                                <TabPane tab={<span><Icon type="line-chart"/>按书名执行分类汇总的明细表</span>} key="2">
                                    <Table pagination={false} columns={columnsB} dataSource={tableB}/>
                                </TabPane>
                            }
                            {tableC.length > 0 &&
                                <TabPane tab={<span><Icon type="area-chart"/>按类型执行分类汇总的明细表</span>} key="3">
                                    <Table columns={columnsC} dataSource={tableC}/>
                                </TabPane>
                            }
                            {tableC.length > 0 &&
                                <TabPane tab={<span><Icon type="pie-chart"/>按业务类型执行分类汇总的明细表</span>} key="4">
                                    <Table columns={columnsD} dataSource={tableC}/>
                                </TabPane>
                            }
                        </Tabs>
                    </Col>
                </Row>

            </div>
        ];
    }
}

export default TablePage;