import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Row, Col, Card} from 'antd';
import {LineChart, Line, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';


const data = [
    { name: '2017-01', uv: 300, pv: 2600, amt: 3400 },
    { name: '2017-02', uv: 400, pv: 4367, amt: 6400 },
    { name: '2017-03', uv: 300, pv: 1398, amt: 2400 },
    { name: '2017-04', uv: 200, pv: 9800, amt: 2400 },
    { name: '2017-05', uv: 278, pv: 3908, amt: 2400 },
    { name: '2017-06', uv: 189, pv: 4800, amt: 2400 },
    { name: '2017-07', uv: 189, pv: 4800, amt: 2400 },
    { name: '2017-08', uv: 309, pv: 4800, amt: 2400 },
  ];

class DashboardPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            
        };
    }


    render() {
        const {} = this.state;
  
        return (
            <div>
                <Row gutter={8}>
                    <Col>
                        <Card>
                            <p>上一次同步: 9 天前</p>
                            <p>上一次同步时间段: 2017-10-10 至 2018-5-1</p>
                            <p>当前数据时间跨度: 2015-01-01 至 2018-5-1</p>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Card>
                            <LineChart width={550} height={200} data={data}>
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                {/* <Line type="monotone" dataKey="pv" stroke="#ffffff" /> */}
                                {/* <CartesianGrid stroke="#ccc" /> */}
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <AreaChart width={550} height={200} data={data}
                                margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                <XAxis dataKey="time"/>
                                <YAxis/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Legend verticalAlign="top" height={54} align="center" iconType="square"/>
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" />
                            </AreaChart>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>

                    </Col>
                    <Col span={12}>

                    </Col>
                </Row>
            </div>
        );
    }
}

export default DashboardPage;