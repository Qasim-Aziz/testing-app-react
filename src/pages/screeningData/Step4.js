/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
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
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Select,
    Typography,
    Progress,
} from 'antd'
import { connect } from 'react-redux'



const { Title, Text } = Typography
const { Option } = Select

@connect(({ screening, user }) => ({ screening, user }))
class Step4 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount(){
        const {dispatch} = this.props

        dispatch({
            type: 'screening/GET_AREAS',
        })
    }

    onChange = (value, id) => {
        const { dispatch, screening: {Areas, RecordedObject, AreasResponse}} = this.props
        // if(AreasResponse[id].recorded === true){
        //     console.log('update', value, id)
        // }
        // else{
        //     console.log('record', value, id)

        let val = ''
        if(value === 'ADVANCED'){
            val = 'advanced'
        }
        if(value === 'DELAYED'){
            val = 'delayed'
        }
        if(value === 'ONTRACK'){
            val = 'onTrack'
        }

            dispatch({
                type: 'screening/RECORD_AREA_RESPONSE',
                payload: {
                    areaId: id,
                    response: val
                }
            })
        // }
    }

    render() {
        const textStyle = {
            fontSize: '18px',
            lineHeight: '27px',
        }
        const titleStyle = {
            fontSize: '25px',
            lineHeight: '47px',
            marginTop: '5px',
        }

        const contentCardStyle = {
            background: '#FFFFFF',
            border: '1px solid #E4E9F0',
            boxShadow: '0px 0px 4px rgba(53, 53, 53, 0.1)',
            borderRadius: 10,
            padding: '16px 12px',
            alignItems: 'center',
            display: 'block',
            margin: '20px',
            lineHeight: '27px',
            marginTop: '10px',
        }

        const {screening: {Areas, RecordedObject, AreasResponse}, user: {role}} = this.props

        return (
            <>
                <Text style={textStyle}>Screening Result</Text>
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
                        minHeight: '180px'
                    }}
                >   
                    <div style={{width: '25%', display: 'inline-block'}}>
                        <Progress style={{marginLeft: '30px'}} type="dashboard" percent={75} />
                    </div>
                    <div style={{width: '75%', display: 'inline-block'}}>
                        <Title style={titleStyle}>{RecordedObject?.name}&apos;s Screening Result </Title>
                        <p>Don't let what you can't do stop you from doing what you can do.</p>
                    </div>
                    
                </div>
                
                <Row>
                    {Areas.length > 0 ? 
                        <>
                            {Areas.map((item) => 
                                <Col sm={12}>
                                    <div style={contentCardStyle}>
                                        <Title style={{fontSize:'18px', lineHeight: '24px', display: 'block'}}>{item.name}</Title>
                                        
                                        {AreasResponse[item.id].recorded === true ?
                                            <>
                                            {role === 'parents' ? 
                                                <Title style={{fontSize: '16px', lineHeight:'18px', color: 'green'}}>{AreasResponse[item.id].response.response}</Title>
                                            :

                                                <Select
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    placeholder="Select a suitable response"
                                                    optionFilterProp="children"
                                                    value={AreasResponse[item.id].response.response}
                                                    onSelect={(e) => this.onChange(e, item.id)}
                                                    filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    <Option value="DELAYED">Delayed</Option>
                                                    <Option value="ONTRACK">On Track</Option>
                                                    <Option value="ADVANCED">Advanced</Option>
                                                </Select>
                                            }
                                            </>
                                        :
                                            <>
                                            {role === 'parents' ? 
                                                <Title style={{fontSize: '16px', lineHeight:'18px', color: 'green'}}>Pending</Title>
                                            :

                                                <Select
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    placeholder="Select a suitable response"
                                                    optionFilterProp="children"
                                                    onSelect={(e) => this.onChange(e, item.id)}
                                                    filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    <Option value="DELAYED">Delayed</Option>
                                                    <Option value="ONTRACK">On Track</Option>
                                                    <Option value="ADVANCED">Advanced</Option>
                                                </Select>
                                            }
                                            </>
                                        }


                                        <div style={{marginTop: '10px'}}>
                                            <Text>{item.description}</Text>
                                        </div>
                                        <Progress percent={50} showInfo={false} />
                                    </div>
                                </Col>
                            )}
                            
                        </>
                    :
                        <p>NO Area found</p>
                    }
                    
                </Row>
                
            </>
        )
    }
}

export default Step4
