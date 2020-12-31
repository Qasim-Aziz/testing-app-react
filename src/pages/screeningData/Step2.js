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
/* eslint-disable no-var */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */

import React from 'react'
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
} from 'antd'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'



const { Title, Text } = Typography

@connect(({ screening }) => ({ screening }))
class Step2 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            englishObject: null,
            hindiObject: null,
            selectedObject: 'ENGLISH',
        }
    }

    componentDidMount(){
        const {screening: {InstructionVideos}} = this.props
        let eng = null
        let hindi = null
        if (InstructionVideos){
            if (InstructionVideos.edges.length > 0){
                InstructionVideos.edges.map((item) => {
                    if(item.node.language === 'ENGLISH'){
                        eng = item.node
                    }
                    else if (item.node.language === 'HINDI'){
                        hindi = item.node
                    }
                })
            }
        }
        this.setState({
            englishObject: eng,
            hindiObject: hindi
        })

    }

    changeLanguage = lang => {
        this.setState({
            selectedObject: lang
        })
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
        const buttonStyle = {
            float: 'right',
        }
        const selectedButtonStyle = {
            float: 'right',
            backgroundColor: '#FF9C52',
            color: 'white'
        }

        const {screening: {RecordedObject}} = this.props
        const {selectedObject, englishObject, hindiObject} = this.state

        return (
            <>
                <Text style={titleStyle}>{RecordedObject.name}&apos;s Screening Instructions</Text>
                <Button type="link" onClick={() => this.changeLanguage('HINDI')} style={selectedObject === 'HINDI' ? selectedButtonStyle : buttonStyle}>Hindi</Button>
                <Button type="link" onClick={() => this.changeLanguage('ENGLISH')} style={selectedObject === 'ENGLISH' ? selectedButtonStyle : buttonStyle}>English</Button>
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
                    {selectedObject === 'ENGLISH' ?
                        <>
                            <ReactPlayer
                                url="http://techslides.com/demos/sample-videos/small.mp4"
                                className="react-player"
                                playing={false}
                                width="100%"
                                height="400px"
                                controls
                            />

                            <Title style={{fontSize: '18px', lineHeight: '27px', marginTop: '20px'}}>English Audio</Title>
                            <div style={{width: '100%', }}>
                                <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" style={{width: '100%'}}>
                                    <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
                                </audio>
                            </div>
                            <Button style={{marginTop: '10px'}}>Download Instructions PDF</Button>
                        </>
                    :
                        <>
                            <ReactPlayer
                                url="http://techslides.com/demos/sample-videos/small.mp4"
                                className="react-player"
                                playing={false}
                                width="100%"
                                height="400px"
                                controls
                            />

                            <Title style={{fontSize: '18px', lineHeight: '27px', marginTop: '20px'}}>Hindi Audio</Title>
                            <div style={{width: '100%', }}>
                                <audio controls src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" style={{width: '100%'}}>
                                    <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
                                </audio>
                            </div>
                            <Button style={{marginTop: '10px'}}>Download Instructions PDF</Button>
                        </>
                    }

                </div> 
            </>
        )
    }
}

export default Step2
