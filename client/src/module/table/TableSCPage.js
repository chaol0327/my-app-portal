import React, {Component} from 'react';
import {Col, Row, DatePicker, Button, Input, Icon, Divider, Tabs, Table, message, Alert} from 'antd';
import request from 'superagent';
import moment from 'moment';
import _ from 'lodash';
import {API_PREFIX as prefix} from '../../common/Constant';

const TabPane = Tabs.TabPane;

const TablePagination = {
    defaultCurrent: 1,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    size: "middle"
}
const columnsA = [{
        title: '时间',
        dataIndex: 'date',
        sorter: (a, b) => moment(a.date) - moment(b.date),
        render: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD");
        }
    }, {
        title: '书名',
        dataIndex: 'bookName',
        sorter: (a, b) => a.bookName.localeCompare(b.bookName)
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
            dataIndex: 'bookName',
            sorter: (a, b) => a.bookName.localeCompare(b.bookName)
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
        }, {
            title: '类型',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type)
        }, {
            title: '业务类型',
            dataIndex: 'businessType',
            sorter: (a, b) => a.businessType.localeCompare(b.businessType)
        }, {
            title: '近90天数量（册）',
            dataIndex: 'countFor90',
            sorter: (a, b) => a.countFor90 - b.countFor90,
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180',
            sorter: (a, b) => a.countFor180 - b.countFor180,
        }, {
            title: '近360天数量（册）',
            dataIndex: 'countFor360',
            sorter: (a, b) => a.countFor360 - b.countFor360,
        }, {
            title: '数量同比增幅',
            dataIndex: 'increase',
            sorter: (a, b) => {
                const aValue = isNaN(Number.parseFloat(a.increase)) ? 0 : Number.parseFloat(a.increase);
                const bValue = isNaN(Number.parseFloat(b.increase)) ? 0 : Number.parseFloat(b.increase);
                return aValue - bValue
            }
        }, {
            title: '时间段',
            dataIndex: 'dateRange'
        }
    ], columnsC = [
        {
            title: '类型',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type)
        }, {
            title: '数量',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        }, {
            title: '码洋',
            dataIndex: 'maYang',
            sorter: (a, b) => a.maYang - b.maYang,
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180',
            sorter: (a, b) => a.countFor180 - b.countFor180,
        }, {
            title: '近360天数量（册）',
            dataIndex: 'countFor360',
            sorter: (a, b) => a.countFor360 - b.countFor360,
        }, {
            title: '占比',
            dataIndex: 'proportion',
            sorter: (a, b) => {
                const aValue = isNaN(Number.parseFloat(a.proportion)) ? 0 : Number.parseFloat(a.proportion);
                const bValue = isNaN(Number.parseFloat(b.proportion)) ? 0 : Number.parseFloat(b.proportion);
                return aValue - bValue;
            }
        }, {
            title: '数量同比增幅',
            dataIndex: 'increase',
            sorter: (a, b) => {
                const aValue = isNaN(Number.parseFloat(a.increase)) ? 0 : Number.parseFloat(a.increase);
                const bValue = isNaN(Number.parseFloat(b.increase)) ? 0 : Number.parseFloat(b.increase);
                return aValue - bValue
            }
        }],
    columnsD = [
        {
            title: '业务类型',
            dataIndex: 'businessType',
            sorter: (a, b) => a.businessType.localeCompare(b.businessType)
        }, {
            title: '数量',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        }, {
            title: '码洋',
            dataIndex: 'maYang',
            sorter: (a, b) => a.maYang - b.maYang,
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180',
            sorter: (a, b) => a.countFor180 - b.countFor180,
        }, {
            title: '近360天数量（册）',
            dataIndex: 'countFor360',
            sorter: (a, b) => a.countFor360 - b.countFor360,
        }, {
            title: '占比',
            dataIndex: 'proportion',
            sorter: (a, b) => {
                const aValue = isNaN(Number.parseFloat(a.proportion)) ? 0 : Number.parseFloat(a.proportion);
                const bValue = isNaN(Number.parseFloat(b.proportion)) ? 0 : Number.parseFloat(b.proportion);
                return aValue - bValue;
            }
        }, {
            title: '数量同比·',
            dataIndex: 'increase',
            sorter: (a, b) => {
                const aValue = isNaN(Number.parseFloat(a.increase)) ? 0 : Number.parseFloat(a.increase);
                const bValue = isNaN(Number.parseFloat(b.increase)) ? 0 : Number.parseFloat(b.increase);
                return aValue - bValue
            }
        }
    ];

const tableConfig1 = {}, tableConfig2 = {
    pagination: 'none',
}


class TableSCPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableA: [],
            tableB: [],
            tableC1: [],
            tableC2: [],
            loading: false
        };
    }

    componentDidMount() {
    }

    componentDidCatch(error, info) {
        console.error(error);
    }

    preSearch = () => {
        const {fromTT, toTT} = this.state;
        if (fromTT && toTT) {
            this.setState({invalidInput: false}, this.search);
        } else {
            this.setState({invalidInput: true});
        }

    }

    reset = () => {
        this.setState({
            bookName: undefined,
            fromTT: undefined,
            toTT: undefined,
            tableA: [],
            tableB: [],
            tableC1: [],
            tableC2: [],
            resetLoading: true
        }, () => {
            this.search().finally(() => {
                message.success("重置成功。");
                this.setState({resetLoading: false});
            });
        });
    }


    search = () => {
        let {bookName, fromTT, toTT} = this.state;
        toTT = toTT ? toTT : moment();
        const query = `?search=${bookName ? bookName : ""}&from=${fromTT ? fromTT : 0}&to=${toTT}`,
            path = `${prefix}/tableas${query}`;

        this.setState({loading: true});
        return request.get(path).then((response) => {
            const data = response.body;
            this.setState({tableA: data});
        }).then(() => {
            return request.get(`${prefix}/tablebs${query}`)
                .then((response) => {
                    const data = response.body;
                    const total_tableb_count = this.countingDataByAttribute(data, 'count'),
                        total_tableb_mayang = this.countingDataByAttribute(data, 'maYang'),
                        total_tableb_90count = this.countingDataByAttribute(data, 'countFor90'),
                        total_tableb_180count = this.countingDataByAttribute(data, 'countFor180'),
                        total_tableb_360count = this.countingDataByAttribute(data, 'countFor360'),
                        total_tableb_increase = this.countingDataByAttribute(data, 'increase');
                    this.setState({
                        tableB: data, total_tableb_count, total_tableb_mayang,
                        total_tableb_90count, total_tableb_180count, total_tableb_360count, total_tableb_increase
                    });
                });
        }).then(() => {
            if (bookName == undefined || bookName.length <= 0) {
                return request.get(`${prefix}/tablec1s${query}`)
                    .then((response) => {
                        const data = response.body;
                        const total_tablec_count = this.countingDataByAttribute(data, 'count'),
                            total_tablec_mayang = this.countingDataByAttribute(data, 'maYang'),
                            total_tablec_180count = this.countingDataByAttribute(data, 'countFor180'),
                            total_tablec_360count = this.countingDataByAttribute(data, 'countFor360'),
                            total_tablec_increase = this.countingDataByAttribute(data, 'increase');
                        this.setState({
                            tableC1: data, total_tablec_count, total_tablec_mayang,
                            total_tablec_180count, total_tablec_360count, total_tablec_increase
                        });
                        return request.get(`${prefix}/tablec2s${query}`)
                            .then((response) => {
                                const data = response.body;
                                const total_tabled_count = this.countingDataByAttribute(data, 'count'),
                                    total_tabled_mayang = this.countingDataByAttribute(data, 'maYang'),
                                    total_tabled_180count = this.countingDataByAttribute(data, 'countFor180'),
                                    total_tabled_360count = this.countingDataByAttribute(data, 'countFor360'),
                                    total_tabled_increase = this.countingDataByAttribute(data, 'increase');
                                this.setState({
                                    tableC2: data, total_tabled_count, total_tabled_mayang,
                                    total_tabled_180count, total_tabled_360count, total_tabled_increase
                                });
                            })
                    })
            }
        }).then(() => {
            this.setState({loading: false});
            message.success("查询成功。");
        }).catch(err => {
            this.setState({loading: false});
            message.error("查询失败，请重试。");
            console.error(err);
        });
    }

    countingDataByAttribute = (data, attribute) => {
        let result = data.reduce((sum, unit) => {
            if (unit[attribute] && unit[attribute] != null)
                return sum + _.toNumber(unit[attribute]);
            else
                return sum;
        }, 0);
        return result.toFixed(0);
    };

// <Col>数量（册）： {total_tableb_count}</Col>
// <Col>码洋（元）： {total_tableb_mayang}</Col>
//     <Col>近90天数量（册）： {total_tableb_90count}</Col>
//     <Col>近180天数量（册）： {total_tableb_180count}</Col>
//     <Col>近360天数量（册）： {total_tableb_360count}</Col>
//     <Col>数量同比增幅： {total_tableb_countZF}</Col>

    emitEmpty = () => {
        this.bookNameInput.focus();
        this.setState({bookName: ''});
    }
    onChangeUserName = (e) => {
        this.setState({bookName: e.target.value});
    }


    render() {
        const {loading, resetLoading, bookName, fromTT, toTT, tableA, tableB, tableC1, tableC2} = this.state;
        const suffix = bookName ? <Icon type="close-circle" onClick={this.emitEmpty}/> : null;

        return [
            <h1 key="module_sc_title">
                生产数据
            </h1>,
            <div key="module_sc_content">
                <Row gutter={16}>
                    <Col span={4} offset={1}>
                        <DatePicker value={fromTT} placeholder="起始日期(必填)"
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
                        <DatePicker value={toTT} placeholder="结束日期(必填)"
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
                    <Col span={5}>
                        <Input
                            placeholder="请输入书名(选填)"
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            suffix={suffix} value={bookName}
                            onChange={this.onChangeUserName}
                            ref={node => this.bookNameInput = node}/>
                    </Col>
                    <Col span={5} offset={1}>
                        <Button onClick={this.search} loading={loading} type="primary"
                                icon="search">查询</Button>
                        <Button style={{marginLeft: '10px'}} onClick={this.reset} loading={resetLoading}
                                disabled={!(fromTT || toTT)} icon="sync">重置</Button>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={22} offset={1}>
                        <Tabs defaultActiveKey="1" tabBarExtraContent={[
                            <Button type="primary" key="tabAction2" href="/exports" icon="export">导出</Button>
                        ]}>
                            <TabPane tab={<span><Icon type="desktop"/>原始数据明细表</span>} key="1">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsA} dataSource={tableA}/>
                            </TabPane>
                            <TabPane disabled={tableB.length <= 0}
                                     tab={<span><Icon type="line-chart"/>按书名执行分类汇总的明细表</span>} key="2">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsB} dataSource={tableB} footer={
                                    () => {
                                        return ([
                                            <Row key="r1">
                                                <h3>汇总</h3>
                                            </Row>,
                                            <Row gutter={16} key="r2">
                                                <Col span={5}>数量（册）： {this.state.total_tableb_count}</Col>
                                                <Col span={5}>码洋（元）： {this.state.total_tableb_mayang}</Col>
                                            </Row>
                                            // ,
                                            // <Row gutter={16} key="r3">
                                            //     <Col span={5}>近90天数量（册）： {this.state.total_tableb_90count}</Col>
                                            //     <Col span={5}>近180天数量（册）： {this.state.total_tableb_180count}</Col>
                                            //     <Col span={5}>近360天数量（册）： {this.state.total_tableb_360count}</Col>
                                            //     <Col span={5}>数量同比增幅： {this.state.total_tableb_increase}</Col>
                                            // </Row>
                                        ]);
                                    }
                                }/>
                            </TabPane>
                            <TabPane disabled={tableC1.length <= 0}
                                     tab={<span><Icon type="area-chart"/>按类型执行分类汇总的明细表</span>} key="3">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsC} dataSource={tableC1} footer={
                                    () => {
                                        return ([
                                            <Row key="r1">
                                                <h3>汇总</h3>
                                            </Row>,
                                            <Row gutter={16} key="r2">
                                                <Col span={5}>数量（册）： {this.state.total_tablec_count}</Col>
                                                <Col span={5}>码洋（元）： {this.state.total_tablec_mayang}</Col>
                                            </Row>
                                            // ,
                                            // <Row gutter={16} key="r3">
                                            //     <Col span={5}>近180天数量（册）： {this.state.total_tablec_180count}</Col>
                                            //     <Col span={5}>近360天数量（册）： {this.state.total_tablec_360count}</Col>
                                            //     <Col span={5}>数量同比增幅： {this.state.total_tablec_increase}</Col>
                                            // </Row>
                                        ]);
                                    }
                                }/>
                            </TabPane>
                            <TabPane disabled={tableC2.length <= 0}
                                     tab={<span><Icon type="pie-chart"/>按业务类型执行分类汇总的明细表</span>} key="4">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsD} dataSource={tableC2} footer={
                                    () => {
                                        return ([
                                            <Row key="r1">
                                                <h3>汇总</h3>
                                            </Row>,
                                            <Row gutter={16} key="r2">
                                                <Col span={5}>数量（册）： {this.state.total_tabled_count}</Col>
                                                <Col span={5}>码洋（元）： {this.state.total_tabled_mayang}</Col>
                                            </Row>
                                            // ,
                                            // <Row gutter={16} key="r3">
                                            //     <Col span={5}>近180天数量（册）： {this.state.total_tabled_180count}</Col>
                                            //     <Col span={5}>近360天数量（册）： {this.state.total_tabled_360count}</Col>
                                            //     <Col span={5}>数量同比增幅： {this.state.total_tabled_increase}</Col>
                                            // </Row>
                                        ]);
                                    }
                                }/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </div>
        ];
    }
}

export default TableSCPage;