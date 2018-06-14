import React, {Component} from 'react';
import {Col, Row, DatePicker, Button, Input, Icon, Divider, Tabs, Table, message, Alert} from 'antd';
import request from 'superagent';
import moment from 'moment';

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
            title: '码洋',
            dataIndex: 'maYang'
        }, {
            title: '类型',
            dataIndex: 'type'
        }, {
            title: '业务类型',
            dataIndex: 'businessType'
        }, {
            title: '近90天数量（册）',
            dataIndex: 'countFor90'
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180'
        }, {
            title: '近360天数量（册）',
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
            title: '码洋',
            dataIndex: 'maYang'
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180'
        }, {
            title: '近360天数量（册）',
            dataIndex: 'countFor360'
        }, {
            title: '占比',
            dataIndex: 'proportion'
        }, {
            title: '数量同比增幅',
            dataIndex: 'increase'
        }],
    columnsD = [
        {
            title: '业务类型',
            dataIndex: 'businessType'
        }, {
            title: '数量',
            dataIndex: 'count'
        }, {
            title: '码洋',
            dataIndex: 'maYang'
        }, {
            title: '近180天数量（册）',
            dataIndex: 'countFor180'
        }, {
            title: '近360天数量（册）',
            dataIndex: 'countFor360'
        }, {
            title: '占比',
            dataIndex: 'proportion'
        }, {
            title: '数量同比增幅',
            dataIndex: 'increase'
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
        this.search();
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
        this.setState({bookName:undefined, fromTT: undefined, toTT: undefined, tableA:[], tableB:[], tableC1:[], tableC2:[], resetLoading: true}, () => {
            this.search().finally(() => {
                message.success("重置成功。");
                this.setState({resetLoading: false});
            });
        });
    }


    search = () => {
        const {bookName, fromTT, toTT} = this.state;

        const query = `?search=${bookName ? bookName : ""}${fromTT ? "&from=" + fromTT : ''}${toTT ? "&to=" + toTT : ''}`,
            path = `/tableas${query}`;

        this.setState({loading: true});
        return request.get(path).then((response) => {
            const data = response.body;
            this.setState({tableA: data});
            // return request.get("/tableB");
        }).then(() => {
            if (fromTT && toTT) {
                return request.get(`/tablebs${query}`)
                    .then((response) => {
                        const data = response.body;
                        this.setState({tableB: data});
                    });
            }
        }).then(() => {
            if (fromTT && toTT && (bookName === undefined || bookName.length <= 0)) {
                return request.get(`/tablec1s${query}`)
                    .then((response) => {
                        const data = response.body;
                        // TODO - C1 key type distinct list
                        this.setState({tableC1: data});
                        return request.get(`/tablec2s${query}`)
                            .then((response) => {
                                const data = response.body;
                                // TODO - C2 key type distinct list
                                this.setState({tableC2: data});
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

    }

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
                        <DatePicker value={fromTT} placeholder="请选择起始日期(必填)"
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
                        <DatePicker value={toTT} placeholder="请选择结束日期(必填)"
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
                        <Button onClick={this.search} loading={loading} disabled={!(fromTT && toTT)} type="primary"
                                icon="search">查询</Button>
                        <Button style={{marginLeft: '10px'}} onClick={this.reset} loading={resetLoading} disabled={!(fromTT && toTT)} icon="sync">重置</Button>
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
                                       columns={columnsA} dataSource={tableA} />
                            </TabPane>
                            <TabPane disabled={tableB.length <= 0}
                                     tab={<span><Icon type="line-chart"/>按书名执行分类汇总的明细表</span>} key="2">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsB} dataSource={tableB} footer={
                                    () => {
                                        return (
                                            <Row gutter={16}>
                                                <Col></Col>
                                                <Col></Col>
                                                <Col></Col>
                                            </Row>);
                                    }
                                }/>
                            </TabPane>
                            <TabPane disabled={tableC1.length <= 0}
                                     tab={<span><Icon type="area-chart"/>按类型执行分类汇总的明细表</span>} key="3">
                                <Table rowKey="id" loading={loading} pagination={TablePagination} size="middle"
                                       columns={columnsC} dataSource={tableC1} footer={
                                    () => {
                                        return (
                                            <Row gutter={16}>
                                                <Col></Col>
                                                <Col></Col>
                                                <Col></Col>
                                            </Row>);
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
                                                汇总
                                            </Row>,
                                            <Row gutter={16}>
                                                <Col>数量（册）： {total_tableb_count}</Col>
                                                <Col>码洋（元）： {total_tableb_mayang}</Col>
                                            </Row>,
                                            <Row gutter={16}>
                                                <Col>近90天数量（册）： {total_tableb_90count}</Col>
                                                <Col>近180天数量（册）： {total_tableb_180count}</Col>
                                                <Col>近360天数量（册）： {total_tableb_360count}</Col>
                                                <Col>数量同比增幅： {total_tableb_countZF}</Col>
                                            </Row>

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