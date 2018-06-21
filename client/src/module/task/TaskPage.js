import React, {Component} from 'react';
import {Col, Row, Button, Upload, Icon, message, Modal, Select, DatePicker} from 'antd';
import request from 'superagent';
import _ from 'lodash';
import {API_PREFIX as prefix, IS_FAKE_MODE as isFake} from '../../common/Constant';

const SyncTypeShowName = {
    bookAndTypeData: "图书分类数据表",
    shengchanData: "生产模块",
    rukuData: "入库模块"
}
const tableProps = {
    name: 'record',
    multiple: false,
    action: isFake ? "/api/import/files" : `${prefix}/files`,
    listType: 'picture',
}

class TaskPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            fileStatusList: [],
            selectFile: undefined,
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
                            thumbUrl: isFake ? '/img/excel.png' : `${prefix}/img/excel.png`,
                            url: `${prefix}/files/${file}`,
                        };
                    });
                    fileStatusList = _.uniqBy(fileStatusList, 'name');
                    this.setState({fileStatusList});
                }
            });
    }

    getFileList = () => {
        return request.get(`${prefix}/files`)
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
            request.delete(`${prefix}/files/${file.name}`).end(function (err, res) {
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
            file['thumbUrl'] = `${prefix}/img/excel.png`;
            file['url'] = `${prefix}/files/${file.name}`;
            return file;
        });
        this.setState({fileStatusList});
    }

    //modal part
    showModal = () => {
        this.setState({
            visible: true, selectFile: undefined, syncType: undefined
        }, this.getFileList);
    }
    handleSync = () => {
        const {syncType, selectFile} = this.state;
        this.setState({loading: true});
        request.put(`${prefix}/syncData/${syncType}/${selectFile}`)
            .then(() => {
                this.setState({loading: false}, () => {
                    message.success(`${selectFile} 导入成功。`);
                });
            }).catch((error) => {
                console.error(error);
                this.setState({loading: false}, () => {
                    message.error(`${selectFile} 导入失败，请下次重试。`);
                });
            })
    };

    handleCancel = () => {
        this.setState({visible: false, selectFile: undefined, syncType: undefined});
    }

    render() {
        const {visible, loading, fileList, fileStatusList, syncType, selectFile} = this.state;
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
                               disabled={!(syncType && selectFile)}
                               loading={loading} onClick={this.handleSync}>确定</Button>,
                   ]}
            >
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
                            value={selectFile}
                            style={{width: '100%'}}
                            placeholder="请选择导入的文件"
                            onChange={(value) => {
                                this.setState({selectFile: value});
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