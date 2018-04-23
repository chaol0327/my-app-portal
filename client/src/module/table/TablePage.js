import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Col, Row, DatePicker} from 'antd';


class TablePage extends Component {


    constructor(props) {
        super(props);
        this.state = {
            
        };
    }


    render() {
        const {} = this.state;
  
        return (
            <div>
                <Row>
                    <Col span={4}>
                        <label>Start:</label>
                        <DatePicker />
                    </Col>
                    <Col span={4}>
                        <label>End:</label>
                        <DatePicker />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default TablePage;