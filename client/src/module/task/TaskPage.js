import React, {Component} from 'react';
import {Col, Row, Button, Upload, Icon, message, Modal, Select, DatePicker} from 'antd';
import request from 'superagent';
import _ from 'lodash';


const SyncTypeShowName = {
    bookAndTypeData: "图书分类数据表",
    shengchanData: "生产模块",
    rukuData: "入库模块"
}
const tableProps = {
    name: 'record',
    multiple: false,
    action: '/files',
    listType: 'picture',
}

class TaskPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            fileStatusList: [],
            selectFiles: [],
            syncType: undefined,
            loading: false,
            visible: false,
        };
    }

    componentWillMount() {
        this.getFileList()
            .then((res) => {
                if (res) {
                    let fileStatusList = res.map((file, index) => {
                        return {
                            uid: index, name: file, staus: 'done',
                            thumbUrl: '/img/excel.png',
                            url: `/files/${file}`
                        };
                    });
                    fileStatusList = _.uniqBy(fileStatusList, 'name');
                    this.setState({fileStatusList});
                }
            });
    }

    getFileList = () => {
        return request.get(`/files`)
            .then((res) => {
                let fileList = res.body;
                this.setState({fileList});
                return fileList;
            });
    }

    confirmUpload = (file, fileList) => {
        // return new Promise(() => {});
        return true;
    }
    removeFile = (file) => {
        return new Promise((resolve, reject) => {
            request.delete(`/files/${file.name}`).end(function (err, res) {
                if (res.ok) {
                    message.success(`${file.name} 删除成功。`);
                    resolve(true);
                } else {
                    message.error(`${file.name} 删除失败。`);
                    reject(err);
                }
            });
        })
    }

    onUploadChanged = (info) => {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            fileStatusList = _.uniqBy(fileStatusList, 'name');
            message.success(`${info.file.name} 上传成功。`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }

        let fileStatusList = info.fileList.map((file) => {
            file['thumbUrl'] = '/img/excel.png';
            file['url'] = `http://localhost:12378/files/${file.name}`;
            return file;
        });
        this.setState({fileStatusList});
    }

    //modal part
    showModal = () => {
        this.setState({
            visible: true, selectFiles: [], syncType: undefined, fromTT: undefined, toTT: undefined
        }, this.getFileList);
    }
    handleSync = () => {
        const {syncType, selectFiles, fromTT, toTT} = this.state;
        this.setState({loading: true});
        let count = selectFiles.length;
        selectFiles.forEach((file) => {
            request.put(`/syncData/${syncType}/${file}?from=${fromTT}&to=${toTT}`)
                .then(() => {
                    message.success(`${file} 导入成功。`);
                    if (--count == 0) {
                        this.setState({loading: false, visible: false}, () => {
                            message.success('导入全部完成。');
                        });
                    }
                }).catch((error) => {
                message.error(`${file} 导入失败，请下次重试。`);
                if (--count == 0) {
                    this.setState({loading: false, visible: false}, () => {
                        message.success('导入全部完成。');
                    });
                }
            })
        });
    }
    handleCancel = () => {
        this.setState({visible: false, selectFiles: [], syncType: undefined, fromTT: undefined, toTT: undefined});
    }

    render() {
        const {visible, loading, fileList, fileStatusList, syncType, selectFiles, fromTT, toTT} = this.state;
        return ([
            <Row key="task1">
                <Col span={10} offset={1}>
                    <Upload.Dragger {...tableProps} fileList={fileStatusList} onChange={this.onUploadChanged}
                                    onRemove={this.removeFile}>

                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox"/>
                        </p>
                        <p className="ant-upload-text">点击按钮或拖拽文件,进行上传.</p>
                        <p className="ant-upload-hint">尽支持单个文件上传</p>

                    </Upload.Dragger>
                </Col>
            </Row>,
            <br key="task2"/>,
            <Row key="task3">
                <Col span={2} offset={1}>
                    <Button onClick={this.showModal} type="primary" icon="upload">开始导入</Button>
                </Col>
            </Row>,
            <Modal key="task-modal"
                   visible={visible}
                   title="选择文件并导入"
                   onOk={this.handleSync}
                   onCancel={this.handleCancel}
                   footer={[
                       <Button key="back" onClick={this.handleCancel}>取消</Button>,
                       <Button key="submit" type="primary"
                               disabled={!(syncType && selectFiles && (syncType == 'bookAndTypeData' ? true : (fromTT && toTT)))}
                               loading={loading} onClick={this.handleSync}>确定</Button>,
                   ]}
            >
                {(syncType == 'rukuData' || syncType == 'shengchanData') &&
                [<Row gutter={16} key="sync_1">
                    <Col span={10} offset={1}>
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
                    <Col span={10}>
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
                </Row>,
                    <br key='sync_2'/>]
                }


                <Row gutter={16}>
                    <Col span={8} offset={1}>
                        <Select style={{width: '100%'}}
                                placeholder="请选择导入的模块"
                                value={syncType}
                                onChange={(value) => {
                                    this.setState({syncType: value})
                                }}>
                            {Object.keys(SyncTypeShowName).map((key) => {
                                return <Select.Option key={key}>{SyncTypeShowName[key]}</Select.Option>
                            })}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Select
                            mode="multiple"
                            value={selectFiles}
                            style={{width: '100%'}}
                            placeholder="请选择导入的文件"
                            onChange={(value) => {
                                this.setState({selectFiles: value});
                            }}>
                            {fileList.map((file) => {
                                return <Select.Option key={file}>{file}</Select.Option>;
                            })}
                        </Select>
                    </Col>
                </Row>
            </Modal>
        ]);
    }
}

export default TaskPage;