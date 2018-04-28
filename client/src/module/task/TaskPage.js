import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Col, Row, DatePicker, Button, Progress, Divider, InputNumber, Switch} from 'antd';


class TaskPage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            interval: 7
        };
    }


    render() {
        const {fromTT, toTT, autoFromTT, autoToTT, autoEnabled, interval} = this.state;
  
        return(
        <Row gutter={4}>
            <Col span={12}>
                <h2>手动同步</h2>
                <Row gutter={8}>
                    <Col span={4} offset={1}>
                        <label>起始日期:</label>
                    </Col>
                    <Col span={8}>
                        <DatePicker value={fromTT}
                                    disabledDate={
                                        (current) => {
                                            if (toTT)
                                                return current.isBefore(toTT)
                                            else
                                                return true;
                                        }} onChange={(date, dateString) => {
                            this.setState({fromTT: date});
                        }}/>
                    </Col>
                </Row>
                <br/>
                <Row gutter={8}>
                    <Col span={4} offset={1}>
                        <label>结束时间:</label>
                    </Col>
                    <Col span={8}>
                        <DatePicker value={toTT}
                                    disabledDate={
                                        (current) => {
                                            if (fromTT)
                                                return current.isAfter(fromTT);
                                            else
                                                return true;
                                        }} onChange={(date, dateString) => {
                            this.setState({toTT: date});
                        }}/>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={2} offset={1}>
                        <Button onClick={this.search} type="primary" icon="sync" >开始同步</Button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col span={2}/>
                    <Col span={10}>
                        <Progress type="circle" percent={this.state.percent} status={true ? "active" : "exception"} />
                    </Col>
                </Row>
            </Col>

            <Col span={12}>
                <h2>自动同步</h2>

                <Row>
                    <Col span={8} offset={1}>
                        <label>自动导入数据：</label>
                        <Switch checkedChildren="开" unCheckedChildren="关" checked={autoEnabled} onChange={(checked) => {this.setState({autoEnabled: checked})}} />
                    </Col>
                </Row>
                <br/>
                { autoEnabled &&
                [
                <Row gutter={8}>
                    <Col span={4} offset={1}>
                        <label>起始日期:</label>
                    </Col>
                    <Col span={8}>
                        <DatePicker value={autoFromTT}
                                    disabledDate={
                                        (current) => {
                                            if (autoToTT)
                                                return current.isBefore(autoToTT)
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({autoFromTT: date});
                        }}/>
                    </Col>
                </Row>, <br/>,
                <Row gutter={8}>
                    <Col span={4} offset={1}>
                        <label>结束时间:</label>
                    </Col>
                    <Col span={8}>
                        <DatePicker value={autoToTT}
                                    disabledDate={
                                        (current) => {
                                            if (autoFromTT)
                                                return current.isAfter(autoFromTT);
                                            else
                                                return false;
                                        }} onChange={(date, dateString) => {
                            this.setState({autoToTT: date});
                        }}/>
                    </Col>
                </Row>,

                <br/>,

                <Row gutter={8}>
                    <Col span={12} offset={1}>
                        每<InputNumber style={{marginLeft: '10px', marginRight: '10px'}} min={1} max={10} value={interval} onChange={(value) => {this.setState({interval: value})}} />天，执行一次导入。
                    </Col>
                </Row>,<br/>,
                <Row>
                    <Col span={4} offset={1}>
                        <Button onClick={this.search} type="primary" icon="sync" >保存</Button>
                    </Col>
                </Row>]}
            </Col>
        </Row>
        );
    }
}

export default TaskPage;