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
//{"id":9122,"ycPublicDate":"2017-12-21T00:00:00.000+0000","shouShuDate":"2018-01-02T00:00:00.000+0000",
// "shengChanZhouQi":-12,"bookName":"送审内蒙古 课堂精练 数学 八年级下册 北师大版 双色","price":13.81,
// "count":13140,"maYang":181463.4,"type":"送审","businessType":"送审内蒙"}
//印次出版日期	收书日期	生产周期（天）	书名	定价（元）	数量（册）	码洋（元）	类型	业务分类
const columnsA = [{
        title: '印次出版日期',
        dataIndex: 'ycPublicDate',
        sorter: (a, b) => moment(a.ycPublicDate) - moment(b.ycPublicDate),
        render: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD");
        }
    }, {
        title: '收书日期',
        dataIndex: 'shouShuDate',
        sorter: (a, b) => moment(a.shouShuDate) - moment(b.shouShuDate),
        render: (text, row, index) => {
            return moment(text).format("YYYY-MM-DD");
        }
    }, {
        title: '生产周期（天）',
        dataIndex: 'shengChanZhouQi',
        sorter: (a, b) => a.shengChanZhouQi - b.shengChanZhouQi,
    }, {
        title: '书名',
        dataIndex: 'bookName',
        sorter: (a, b) => a.bookName.localeCompare(b.bookName)
    }, {
        title: '定价（元）',
        dataIndex: 'price',
        sorter: (a, b) => a.price - b.price,
    }, {
        title: '数量（册）',
        dataIndex: 'count',
        sorter: (a, b) => a.count - b.count,
    }, {
        title: '码洋（元）',
        dataIndex: 'maYang',
        sorter: (a, b) => a.maYang - b.maYang,
    }, {
        title: '类型',
        dataIndex: 'type',
        sorter: (a, b) => a.type.localeCompare(b.type)
    }, {
        title: '业务分类',
        dataIndex: 'businessType',
        sorter: (a, b) => a.businessType.localeCompare(b.businessType)
    }],
    //书名	定价（元）	数量（册）	码洋（元）	类型	业务分类
    //{"id":9123,"bookName":"送审内蒙古 课堂精练 数学 八年级下册 北师大版 双色","price":13.81,"count":13140,
    // "maYang":181463.4,"type":"送审","businessType":"送审内蒙"}
    columnsB = [
        {
            title: '书名',
            dataIndex: 'bookName',
            sorter: (a, b) => a.bookName.localeCompare(b.bookName)
        }, {
            title: '定价（元）',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
        }, {
            title: '数量（册）',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        }, {
            title: '码洋（元）',
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
        }
    ],
    //类型	品种数	数量（册）	码洋（元）
    // {"id":12326,"type":"","pinZhongCount":333,"count":44820,"maYang":2080521.6}
    columnsC = [
        {
            title: '类型',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type)
        }, {
            title: '品种数',
            dataIndex: 'pinZhongCount',
            sorter: (a, b) => a.pinZhongCount - b.pinZhongCount,
        }, {
            title: '数量（册）',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        }, {
            title: '码洋（元）',
            dataIndex: 'maYang',
            sorter: (a, b) => a.maYang - b.maYang,
        }],
    //{"id":12335,"businessType":"","pinZhongCount":333,"count":44820,"maYang":2080521.6}
    // 业务分类	品种数	数量（册）	码洋（元）
    columnsD = [
        {
            title: '业务分类',
            dataIndex: 'businessType',
            sorter: (a, b) => a.businessType.localeCompare(b.businessType)
        }, {
            title: '品种数',
            dataIndex: 'pinZhongCount',
            sorter: (a, b) => a.pinZhongCount - b.pinZhongCount,
        }, {
            title: '数量（册）',
            dataIndex: 'count',
            sorter: (a, b) => a.count - b.count,
        }, {
            title: '码洋（元）',
            dataIndex: 'maYang',
            sorter: (a, b) => a.maYang - b.maYang,
        }
    ];


class TableRuKuPage extends Component {

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

    countingDataByAttribute = (data, attribute) => {
        let result = data.reduce((sum, unit) => {
            if (unit[attribute] && unit[attribute] != null)
                return sum + _.toNumber(unit[attribute]);
            else
                return sum;
        }, 0);
        return result.toFixed(0);
    }

    search = () => {
        let {fromTT, toTT} = this.state;
        toTT = toTT ? toTT : moment();
        const query = `?search=&from=${fromTT ? fromTT : 0}&to=${toTT}`,
            path = `${prefix}/tableds${query}`;

        this.setState({loading: true});
        return request.get(path).then((response) => {
            const data = response.body;
            const total_tablea_count = this.countingDataByAttribute(data, 'count'),
                total_tablea_mayang = this.countingDataByAttribute(data, 'maYang');
            this.setState({tableA: data, total_tablea_count, total_tablea_mayang});
        }).then(() => {
            return request.get(`${prefix}/tablees${query}`)
                .then((response) => {
                    const data = response.body;
                    this.setState({tableB: data});
                });
        }).then(() => {
            return request.get(`${prefix}/tablef1s${query}`)
                .then((response) => {
                    const data = response.body;
                    this.setState({tableC1: data});
                    return request.get(`${prefix}/tablef2s${query}`)
                        .then((response) => {
                            const data = response.body;
                            this.setState({tableC2: data});
                        })
                })
        }).then(() => {
            this.setState({loading: false});
            message.success("查询成功。");
        }).catch(err => {
            this.setState({loading: false});
            message.error("查询失败，请重试。");
            console.error(err);
        });
    }

    render() {
        const {loading, resetLoading, fromTT, toTT, tableA, tableB, tableC1, tableC2} = this.state;

        return [
            <h1 key="module_rk_title">
                入库数据
            </h1>,
            <div key="module_rk_content">
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
                                       columns={columnsA} dataSource={tableA} footer={
                                    () => {
                                        return ([
                                            <Row key="r1">
                                                <h3>汇总</h3>
                                            </Row>,
                                            <Row gutter={16} key="r2">
                                                <Col span={5}>数量（册）： {this.state.total_tablea_count}</Col>
                                                <Col span={5}>码洋（元）： {this.state.total_tablea_mayang}</Col>
                                            </Row>]);
                                    }
                                }/>
                            </TabPane>
                            <TabPane disabled={tableB.length <= 0}
                                     tab={<span><Icon type="line-chart"/>按书名执行分类汇总的明细表</span>} key="2">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsB} dataSource={tableB}/>
                            </TabPane>
                            <TabPane disabled={tableC1.length <= 0}
                                     tab={<span><Icon type="area-chart"/>按类型执行分类汇总的明细表</span>} key="3">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsC} dataSource={tableC1}/>
                            </TabPane>
                            <TabPane disabled={tableC2.length <= 0}
                                     tab={<span><Icon type="pie-chart"/>按业务类型执行分类汇总的明细表</span>} key="4">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsD} dataSource={tableC2}/>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>

            </div>
        ];
    }
}

export default TableRuKuPage;