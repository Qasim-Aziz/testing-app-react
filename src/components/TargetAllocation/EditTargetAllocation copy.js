/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { Avatar, Form, Input, Select, Checkbox, Button, Typography, notification, Spin } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import CKEditor from 'react-ckeditor-component'
import moment from 'moment'
import {
    TARGET_ALLOCATIONS_OPTIONS,
    SETTING,
    SHORT_TERM_GOALS,
    CREATE_TARGET,
    UPDATE_TARGET,
    GET_TARGET_STEP,
    GET_TARGET_SD,
} from './query'
import NumberCard from './NumberCard'

const { Text } = Typography

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const SdInput = ({ form, selectedSd }) => {
    const [sdText, setSdText] = useState('')
    const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_TARGET_SD, {
        variables: {
            text: sdText,
        },
    })

    useEffect(() => {
        if (sdError) {
            notification.error({
                message: 'Failed to load sd list',
            })
        }
    }, [sdError])

    return (
        <>
            {(form.getFieldValue('steps') || !form.getFieldValue('steps')) && (
                <Form.Item label="Sd" name="Sd" style={{ marginTop: 15 }}>
                    {form.getFieldDecorator('sd', {
                        initialValue: selectedSd,

                    })(
                        <Select
                            mode="tags"
                            allowClear
                            size="large"
                            notFoundContent={sdLoading ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={v => {
                                setSdText(v)
                            }}
                            loading={sdLoading}
                            disabled={form.getFieldValue('steps')?.length > 0}
                            placeholder="Search for find more sd"
                        >
                            {sdData?.targetSd.edges.map(({ node }) => {
                                return (
                                    <Select.Option key={node.id} value={node.sd}>
                                        {node.sd}
                                    </Select.Option>
                                )
                            })}
                        </Select>,
                    )}
                </Form.Item>
            )}
        </>
    )
}

export default Form.create()(
    ({ form, targetName, targetVideo, targetInstr, selectedTargetId, selectedShortTermGoal, onSuccessTargetAllocation, activeAllocatedTarget }) => {

        const [targetInstructions, setTargetInstructions] = useState('')
        const [dailyTrials, setDailyTrials] = useState(0)
        const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
        const [makeDefault, setMakeDefault] = useState(false)
        const [stepText, setStepText] = useState()
        const studentId = localStorage.getItem('studentId')
        const [peakBlockCount, setPeakBlockCount] = useState(1)
        const [selectedSd, setSelectedSd] = useState([])
        const [selectedStep, setSelectedSteps] = useState([])


        useEffect(() => {
            if (activeAllocatedTarget) {
                const { targetInstr, peakBlocks } = activeAllocatedTarget
                const { targetName, targetType, consecutiveDays, DailyTrials } = activeAllocatedTarget.targetAllcatedDetails
                setDailyTrials(DailyTrials)
                setSessionConsecutiveDays(consecutiveDays)
                setTargetInstructions(targetInstr)
                if (peakBlocks) setPeakBlockCount(peakBlocks)
                else setPeakBlockCount(1)

                if (activeAllocatedTarget.sd.edges.length > 0) {
                    const allocatedSdList = []
                    activeAllocatedTarget.sd.edges.map(item => {
                        allocatedSdList.push(item.node.sd)
                    })
                    setSelectedSd(allocatedSdList)
                }
                if (activeAllocatedTarget.steps.edges.length > 0) {
                    const allocatedStepList = []
                    activeAllocatedTarget.steps.edges.map(item => {
                        allocatedStepList.push(item.node.step)
                    })
                    setSelectedSteps(allocatedStepList)
                }
            }
        }, [activeAllocatedTarget])

        const onChangeNumber = (type, num) => {
            if (type === 'sdt') setDailyTrials(num)
            else if (type === 'scd') setSessionConsecutiveDays(num)
            else if (type === 'spbc' && num > 0) {
                setPeakBlockCount(num)
            }
        }

        const { data: stepData, error: stepError, loading: stepLoading } = useQuery(GET_TARGET_STEP, {
            variables: {
                text: stepText,
            },
        })

        const {
            data: targetOptions,
            error: targetOptionsError,
            loading: targetOptionsLoading,
        } = useQuery(TARGET_ALLOCATIONS_OPTIONS)

        const [
            updateTarget,
            { data: updateTargetData, error: updateTargetError, loading: updateTargetLoading },
        ] = useMutation(UPDATE_TARGET)

        useEffect(() => {
            if (stepError) {
                notification.error({
                    message: 'Failed to load step list',
                })
            }
        }, [stepError])

        useEffect(() => {
            if (updateTargetData) {
                notification.success({
                    message: 'Target Update sucessfully',
                })
                // setOpen(null)
                form.resetFields()
                onSuccessTargetAllocation({ data: updateTargetData })
            }
            if (updateTargetError) {
                notification.error({
                    message: 'Target allocation failed',
                    description: updateTargetError.message,
                })


            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [updateTargetData, updateTargetError])

        function onEditorChange(evt) {
            setTargetInstructions(evt.editor.getData())
        }

        const handleSubmit = e => {
            e.preventDefault()
            form.validateFields((error, values) => {
                if (values.type === 'VGFyZ2V0RGV0YWlsVHlwZTo4') {
                    if (!values.sd) {
                        notification.info({
                            message: 'Sd required for type PEAK',
                        })
                        return
                    }
                }
                if (!targetInstructions) {
                    notification.info({
                        message: 'Target Instruction is mandatory',
                    })
                    return
                }
                if (!error) {
                    updateTarget({
                        variables: {
                            studentId,
                            targetAllocatedId: activeAllocatedTarget.id,
                            targetStatus: values.status,
                            targetInstr: targetInstructions,
                            masteryCriteria: values.masteryCriteria,
                            targetName: values.name,
                            dailyTrials,
                            consecutiveDays: sessionConsecutiveDays,
                            targetType: values.type,
                            sd: values.sd || [],
                            steps: values.steps || [],
                            video: values.video,
                            peakBlocks: peakBlockCount,
                        },
                    })
                }
            })
        }

        if (targetOptionsError) {
            return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
        }

        return (
            <div>
                <Form {...layout} name="basic" onSubmit={handleSubmit}>
                    <Form.Item label="Target Name" name="Target Name">
                        {form.getFieldDecorator('name', {
                            initialValue: activeAllocatedTarget && activeAllocatedTarget.targetAllcatedDetails.targetName,
                            rules: [{ required: true, message: 'Please give a target name' }],
                        })(<Input name="targetName" size="large" />)}
                    </Form.Item>
                    <Form.Item label="Target Type" name="Target Type" style={{ marginTop: 15 }}>
                        {form.getFieldDecorator('type', {
                            initialValue: activeAllocatedTarget && activeAllocatedTarget.targetAllcatedDetails.targetType.id,
                            rules: [{ required: true, message: 'Please select a target type' }],
                        })(
                            <Select size="large" name="targetType">
                                {targetOptions?.types.map(({ id, typeTar }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {typeTar}
                                        </Select.Option>
                                    )
                                })}
                            </Select>,
                        )}
                    </Form.Item>

                    <Form.Item label="Mastery Criteria" name="masteryCriteria" style={{ marginTop: 15 }}>
                        {form.getFieldDecorator('masteryCriteria', {
                            initialValue: activeAllocatedTarget && activeAllocatedTarget.masteryCriteria.id,
                            rules: [{ required: true, message: 'Please select a target type' }],
                        })(
                            <Select size="large" name="masteryCriteria" loading={targetOptionsLoading}>
                                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>,
                        )}
                    </Form.Item>

                    <Form.Item label={<><span style={{color: 'red', fontSize: 10}}>*</span><span>Daily Trials</span></>} style={{ marginTop: 0, marginBottom: 0 }}>

                        <NumberCard
                            // title="Daily Trials"
                            number={dailyTrials}
                            form={form}
                            maxValue={26}
                            setNumber={num => onChangeNumber('sdt', num)}
                            style={{
                                marginLeft: 5,
                                marginTop: 10,
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={<><span style={{color: 'red', fontSize: 10}}>*</span><span>Consecutive Days</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
                        <NumberCard
                            // title="Consecutive Days"
                            number={sessionConsecutiveDays}
                            form={form}
                            setNumber={num => onChangeNumber('scd', num)}
                            style={{
                                marginLeft: 5,
                                marginTop: 10,
                            }}
                        />
                    </Form.Item>


                    <div
                        style={
                            form.getFieldValue('type') === 'VGFyZ2V0RGV0YWlsVHlwZTo4'
                                ? {
                                    display: 'block',
                                    // marginTop: 10,
                                    marginLeft: 5,
                                }
                                : { display: 'none' }
                        }
                    >
                        <Form.Item label={<><span style={{color: 'red', fontSize: 10}}>*</span><span>Peak Blocks</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
                            <NumberCard
                                // title="Peak Blocks"
                                number={peakBlockCount}
                                maxValue={10}
                                setNumber={num => onChangeNumber('spbc', num)}
                                minValue={1}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item label="Status" style={{ marginTop: 15 }}>
                        {form.getFieldDecorator('status', {
                            initialValue: activeAllocatedTarget && activeAllocatedTarget.targetStatus.id,
                            rules: [{ required: true, message: 'Please select a target status' }],
                        })(
                            <Select size="large" loading={targetOptionsLoading}>
                                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {statusName}
                                        </Select.Option>
                                    )
                                })}
                            </Select>,
                        )}
                    </Form.Item>

                    {(form.getFieldValue('sd') || !form.getFieldValue('sd')) && (
                        <Form.Item label="Steps" style={{ marginTop: 15 }}>
                            {form.getFieldDecorator('steps', {
                                initialValue: selectedStep,

                            })(
                                <Select
                                    allowClear
                                    size="large"
                                    loading={stepLoading}
                                    notFoundContent={stepLoading ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={v => {
                                        setStepText(v)
                                    }}
                                    placeholder="Search for find more steps"
                                    mode="tags"
                                    disabled={form.getFieldValue('sd')?.length > 0 || selectedSd.length > 0}
                                >
                                    {stepData?.targetStep.edges.map(({ node }) => {
                                        return (
                                            <Select.Option key={node.id} value={node.step}>
                                                {node.step}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>,
                            )}
                        </Form.Item>
                    )}

                    <SdInput form={form} selectedSd={selectedSd} />

                    <Form.Item
                        label="Target Instructions"
                        name="Target Instructions"
                        style={{ marginTop: 15 }}
                    >
                        <CKEditor
                            name="targetInstructions"
                            activeClass="p10"
                            content={targetInstructions}
                            events={{
                                change: onEditorChange,
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="Target Video Link" name="Target Video" style={{ marginTop: 15 }}>
                        {form.getFieldDecorator('video', {
                            initialValue: activeAllocatedTarget && activeAllocatedTarget.videos.edges[0]?.node.url,
                        })(<Input placeholder="Give the video url" size="large" />)}
                    </Form.Item>

                    <Form.Item {...tailLayout} style={{ marginTop: 15 }}>
                        <Checkbox value={makeDefault} onChange={() => setMakeDefault(state => !state)}>
                            Make values default
                        </Checkbox>
                    </Form.Item>

                    <Form.Item {...tailLayout} style={{ marginTop: 20 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{
                                width: 150,
                            }}
                            loading={updateTargetLoading}
                        >
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    },
)
