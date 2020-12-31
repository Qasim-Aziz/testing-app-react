/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable prefer-template */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Upload, Icon, message
} from 'antd'
import { connect } from 'react-redux'
import reqwest from 'reqwest'

const { Title, Text } = Typography


@connect(({ screening }) => ({ screening }))
class Step3 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            fileList: [],
            uploading: false,
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        const {dispatch} = this.props

        // fileList.forEach(file => {
        //     formData.append('files[]', file);
        // });

        this.setState({
            uploading: true
        })

        formData.append("key", 'assessment_videos/file.txt')


        // You can use any AJAX library you like
        reqwest({
            url: 'https://application.cogniable.us/apis/buckets/s3/signed-url/',
            method: 'post',
            processData: false,
            data: formData,
            success: (result) => {
                console.log(result)
                
                if(result){
                    const finalUrl = result.url+''+result.fields.key
                    // console.log(finalUrl)
                    const algo = result.fields['x-amz-algorithm']
                    const cred = result.fields['x-amz-credential']
                    const date = result.fields['x-amz-date']
                    const sign = result.fields['x-amz-signature']
                    const policy = result.fields.policy

                    // console.log(finalUrl, algo, cred, date, sign, policy)

                    const formVideoData = new FormData();

                    if(fileList.length > 0){
                        formVideoData.append('key', result.fields.key);
                        formVideoData.append('x-amz-algorithm', algo);
                        formVideoData.append('x-amz-credential', cred);
                        formVideoData.append('x-amz-date', date);
                        formVideoData.append('policy', policy);
                        formVideoData.append('x-amz-signature', sign);
                        formVideoData.append('file', fileList[0]);
                    }


                    // video upload api
                    reqwest({
                        url: result.url,
                        method: 'post',
                        processData: false,
                        data: formVideoData,
                        success: () => {
                            console.log('video uploaded success')
                            
                            dispatch({
                                type: 'screening/RECORD_VIDEO',
                                payload: {
                                    url: finalUrl
                                }
                            })

                            this.setState({
                                uploading: false
                            })

                            
                        },
                        error: (err) => {
                            console.log(err)
                            message.error('upload failed.');
                        },
                    });

                }


            },
            error: (err) => {
                console.log(err)
                message.error('upload failed.');
            },
        });

    }



    render() {
        const textStyle = {
            fontSize: '16px',
            lineHeight: '19px',
        }
        const titleStyle = {
            fontSize: '20px',
            lineHeight: '27px',
            marginTop: '5px',
        }
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };


        return (
            <>
                <Text style={titleStyle}>Upload Screening Video</Text>
                <br />
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E4E9F0',
                        boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
                        borderRadius: 10,
                        padding: '16px 12px',
                        alignItems: 'center',
                        display: 'block',
                        width: '100%',
                        marginBottom: '20px',
                        lineHeight: '27px',
                        marginTop: '10px',
                        minHeight: '400px'
                    }}
                >
                    <div style={{textAlign: 'center'}}>
                        <Upload {...props} name="avatar" listType="picture-card" className="avatar-uploader" sshowUploadList={false}>
                            <Button>
                                <Icon type="upload" /> Select File
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={fileList.length === 0}
                            loading={uploading}
                            style={{ marginTop: 16, width: '250px' }}
                        >
                            {uploading ? 'Uploading' : 'Start Upload'}
                        </Button>
                    </div>
                    

                </div>
            </>
        )
    }
}

export default Step3
