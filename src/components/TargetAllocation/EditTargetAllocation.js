/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable no-useless-concat */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react'
import { Avatar, Form, Input, Select, Checkbox, Button, Typography, notification, Spin, Icon, Row, Col, AutoComplete } from 'antd'
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
import { capitalize } from '../../utilities'

let id = 0;
let stepId = 0;
let classId = 0;
const AutoCompleteOption = AutoComplete.Option;
const { Text } = Typography
const { Option } = Select

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default Form.create()(
    ({ form, targetName, targetVideo, targetInstr, selectedTargetId, selectedShortTermGoal, onSuccessTargetAllocation, activeAllocatedTarget, equivalenceEnable = false }) => {
        console.log(activeAllocatedTarget)
        const [targetInstructions, setTargetInstructions] = useState('')
        const [dailyTrials, setDailyTrials] = useState(0)
        const [sessionConsecutiveDays, setSessionConsecutiveDays] = useState(0)
        const [makeDefault, setMakeDefault] = useState(false)
        const [stepText, setStepText] = useState()
        const studentId = localStorage.getItem('studentId')
        const [peakBlockCount, setPeakBlockCount] = useState(1)
        const [selectedSd, setSelectedSd] = useState([])
        const [selectedStep, setSelectedSteps] = useState([])
        const [sdText, setSdText] = useState('')
        const [selectedSdList, setSelectedSdList] = useState([])
        const [selectedSdMC, setSelectedSdMC] = useState([])
        const [selectedSdStatus, setSelectedSdStatus] = useState([])
        const [selectedStepList, setSelectedStepList] = useState([])
        const [selectedStepMC, setSelectedStepMC] = useState([])
        const [selectedStepStatus, setSelectedStepStatus] = useState([])


        useEffect(() => {
            if (activeAllocatedTarget) {
                const { targetInstr, peakBlocks } = activeAllocatedTarget
                const { targetName, targetType, consecutiveDays, DailyTrials } = activeAllocatedTarget.targetAllcatedDetails
                setDailyTrials(DailyTrials)
                setSessionConsecutiveDays(consecutiveDays)
                setTargetInstructions(targetInstr)
                if (peakBlocks) setPeakBlockCount(peakBlocks)
                else setPeakBlockCount(1)

                const selectedSdList = []
                const selectedSdMC = []
                const selectedSdStatus = []
                const selectedSdIndex = []
                const selectedStepList = []
                const selectedStepMC = []
                const selectedStepStatus = []
                const selectedStepIndex = []

                if (activeAllocatedTarget.mastery.edges.length > 0) {
                    activeAllocatedTarget.mastery.edges.map(item => {
                        if (item.node.sd) {
                            selectedSdList.push(item.node.sd.sd)
                            selectedSdMC.push(item.node.mastery.id)
                            selectedSdStatus.push(item.node.status.id)
                        }
                        if (item.node.step) {
                            selectedStepList.push(item.node.step.step)
                            selectedStepMC.push(item.node.mastery.id)
                            selectedStepStatus.push(item.node.status.id)
                        }
                    })
                }

                if (selectedSdList.length > 0) {
                    selectedSdList.map((item, index) => {
                        selectedSdIndex.push(index)
                    })
                }
                if (selectedStepList.length > 0) {
                    selectedStepList.map((item, index) => {
                        selectedStepIndex.push(index)
                    })
                }

                setSelectedSd(selectedSdIndex)
                setSelectedSteps(selectedStepIndex)

                setSelectedSdList(selectedSdList)
                setSelectedSdMC(selectedSdMC)
                setSelectedSdStatus(selectedSdStatus)
                setSelectedStepList(selectedStepList)
                setSelectedStepMC(selectedStepMC)
                setSelectedStepStatus(selectedStepStatus)

                id = selectedSdList.length
                stepId = selectedStepList.length
                classId = activeAllocatedTarget.classes.edges.length

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

        const { data: sdData, error: sdError, loading: sdLoading } = useQuery(GET_TARGET_SD, {
            variables: {
                text: sdText,
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

        const stepsOptions = stepData?.targetStep.edges.map(node => (
            <AutoCompleteOption key={node.node.id} value={node.node.step}>{node.node.step}</AutoCompleteOption>
        ));

        const sdsOptions = sdData?.targetSd.edges.map(node => (
            <AutoCompleteOption key={node.node.id} value={node.node.sd}>{node.node.sd}</AutoCompleteOption>
        ));

        const add = () => {
            // const { form } = this.props;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            const nextKeys = keys.concat(id++);
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                keys: nextKeys,
            });
        };

        const remove = k => {
            // const { form } = this.props;
            // can use data-binding to get
            const keys = form.getFieldValue('keys');
            // We need at least one passenger
            if (keys.length === 0) {
                return;
            }

            // can use data-binding to set
            form.setFieldsValue({
                keys: keys.filter(key => key !== k),
            });
        };

        const addStep = () => {
            // const { form } = this.props;
            // can use data-binding to get
            const stepKeys = form.getFieldValue('stepKeys');
            const nextKeys = stepKeys.concat(stepId++);
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                stepKeys: nextKeys,
            });
        };

        const stepRemove = k => {
            // const { form } = this.props;
            // can use data-binding to get
            const stepKeys = form.getFieldValue('stepKeys');
            // We need at least one passenger
            if (stepKeys.length === 0) {
                return;
            }

            // can use data-binding to set
            form.setFieldsValue({
                stepKeys: stepKeys.filter(key => key !== k),
            });
        };

        const classAdd = () => {
            // const { form } = this.props;
            // can use data-binding to get
            const keys = form.getFieldValue('Classkeys');
            const nextKeys = keys.concat(classId++);
            // can use data-binding to set
            // important! notify form to detect changes
            form.setFieldsValue({
                Classkeys: nextKeys,
            });
        };

        const classRemove = k => {
            // const { form } = this.props;
            // can use data-binding to get
            const keys = form.getFieldValue('Classkeys');
            // We need at least one passenger
            if (keys.length === 0) {
                return;
            }

            // can use data-binding to set
            form.setFieldsValue({
                Classkeys: keys.filter(key => key !== k),
            });
        };

        useEffect(() => {
            if (stepError) {
                notification.error({
                    message: 'Failed to load step list',
                })
            }
        }, [stepError])

        useEffect(() => {
            if (sdError) {
                notification.error({
                    message: 'Failed to load sd list',
                })
            }
        }, [sdError])

        useEffect(() => {
            if (updateTargetData?.updateTargetAllocate2) {
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

            const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
            let selectedAlpha = ['A', 'B']

            if (activeAllocatedTarget?.targetId?.maxSd) {
                selectedAlpha = []
            }
            for (let i = 0; i < activeAllocatedTarget?.targetId?.maxSd; i++) {
                selectedAlpha.push(alphaList[i])
            }

            form.validateFields((error, values) => {
                const { keys, stimulus, stimulusMC, stimulusStatus, stepKeys, steps, stepStatus, stepMC, Classkeys } = values
                // console.log(keys, stimulus, stimulusMC, stimulusStatus, stepKeys, steps, stepStatus, stepMC)

                const classes = []
                Classkeys.map((key, index) => {
                    const sampleStimulus = []
                    selectedAlpha.map((alpha, alphaIndex) => {
                        sampleStimulus.push({ option: alpha, stimulusName: values[`stimulus${key}${alpha}`] })
                    })
                    classes.push({ name: `Class ${index + 1}`, stimuluses: sampleStimulus })
                })

                const sdResponse = []
                const stepResponse = []
                keys.map(id => {
                    sdResponse.push({ sd: stimulus[id], mastery: stimulusMC[id], status: stimulusStatus[id] })
                })
                stepKeys.map(id => {
                    stepResponse.push({ step: steps[id], mastery: stepMC[id], status: stepStatus[id] })
                })
                if (values.type === 'VGFyZ2V0RGV0YWlsVHlwZTo4' && values.category !== 'Equivalance' && sdResponse.length < 1) {

                    notification.info({
                        message: 'Sd required for type PEAK',
                    })

                }
                else if (!targetInstructions) {
                    notification.info({
                        message: 'Target Instruction is mandatory',
                    })

                }
                else if (!error) {
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
                            sd: sdResponse,
                            steps: stepResponse,
                            video: values.video,
                            peakBlocks: peakBlockCount,
                            peakType: values.category ? values.category : null,
                            classes
                        },
                        errorPolicy: 'all',
                    })
                }
            })
        }

        if (targetOptionsError) {
            return <h4 style={{ color: 'red', marginTop: 40 }}>Opps therir are something wrong</h4>
        }

        const { getFieldDecorator, getFieldValue } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
            },
        };
        getFieldDecorator('keys', { initialValue: selectedSd });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <>
                <Form.Item {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? 'Stimulus' : ''} key={k} style={{ marginTop: 0, marginBottom: 0 }}>
                    <Form.Item
                        required={false}
                        key={k}
                        style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                    >
                        {getFieldDecorator(`stimulus[${k}]`, {
                            initialValue: selectedSdList[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input Stimulus's name or delete this field.",
                                },
                            ],
                        })(
                            <AutoComplete
                                dataSource={sdsOptions}
                                onChange={(v) => setSdText(v)}
                            >
                                <Input
                                    placeholder="Stimulus name"
                                />
                            </AutoComplete>
                        )}
                    </Form.Item>
                    <Form.Item
                        required={false}
                        key={k}
                        style={{ display: 'inline-block', width: 'calc(28% - 12px)' }}
                    >
                        {getFieldDecorator(`stimulusStatus[${k}]`, {
                            initialValue: selectedSdStatus[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please Select Status or delete this field.",
                                },
                            ],
                        })(
                            <Select loading={targetOptionsLoading}>
                                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {statusName}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`stimulusMC[${k}]`, {
                            initialValue: selectedSdMC[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please Select Criteria or delete this field.",
                                },
                            ],
                        })(
                            <Select placeholder="select criteria" loading={targetOptionsLoading} style={{ width: '80%', marginRight: 8 }}>
                                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )}
                        {keys.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => remove(k)}
                            />
                        ) : null}

                    </Form.Item>
                </Form.Item>


            </>
        ));

        getFieldDecorator('stepKeys', { initialValue: selectedStep });
        const stepKeys = getFieldValue('stepKeys');
        const formItemsSteps = stepKeys.map((k, index) => (
            <>
                <Form.Item {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)} label={index === 0 ? 'Steps' : ''} key={k} style={{ marginTop: 0, marginBottom: 0 }}>
                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(40% - 12px)' }}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`steps[${k}]`, {
                            initialValue: selectedStepList[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input Step's name or delete this field.",
                                },
                            ],
                        })(
                            <AutoComplete
                                dataSource={stepsOptions}
                                onChange={(v) => setStepText(v)}
                            >
                                <Input
                                    placeholder="Step name"
                                />
                            </AutoComplete>
                        )}
                    </Form.Item>
                    <Form.Item
                        required={false}
                        key={k}
                        style={{ display: 'inline-block', width: 'calc(28% - 12px)' }}
                    >
                        {getFieldDecorator(`stepStatus[${k}]`, {
                            initialValue: selectedStepStatus[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please Select Status or delete this field.",
                                },
                            ],
                        })(
                            <Select loading={targetOptionsLoading}>
                                {targetOptions?.targetStatus.map(({ id, statusName }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {statusName}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
                        required={false}
                        key={k}
                    >
                        {getFieldDecorator(`stepMC[${k}]`, {
                            initialValue: selectedStepMC[k],
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "Please Select Criteria or delete this field.",
                                },
                            ],
                        })(
                            <Select placeholder="select criteria" loading={targetOptionsLoading} style={{ width: '80%', marginRight: 8 }}>
                                {targetOptions?.masteryCriteria.map(({ id, name }) => {
                                    return (
                                        <Select.Option key={id} value={id}>
                                            {name}
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        )}
                        {stepKeys.length > 0 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                onClick={() => stepRemove(k)}
                            />
                        ) : null}

                    </Form.Item>
                </Form.Item>


            </>
        ));

        // start of equivalence class code

        const alphaList = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        let selectedAlpha = ['A', 'B']
        const initialKeyValue = []

        // console.log('Session Details --------->', equivalenceObject)

        if (activeAllocatedTarget?.targetId?.maxSd) {
            selectedAlpha = []
        }
        for (let i = 0; i < activeAllocatedTarget?.targetId?.maxSd; i++) {
            selectedAlpha.push(alphaList[i])
        }

        if (activeAllocatedTarget?.classes?.edges.length > 0) {
            classId = activeAllocatedTarget?.classes?.edges.length
            activeAllocatedTarget?.classes?.edges.map((item, index) => {
                initialKeyValue.push(index)
            })
        }

        getFieldDecorator('Classkeys', { initialValue: initialKeyValue });
        const classKeys = getFieldValue('Classkeys');
        const classFormItems = classKeys.map((k, index) => (
            <>
                <Form.Item
                    label={
                        <>
                            <span>Class {index + 1}</span>
                            <span style={{ float: 'right', right: 0 }}>
                                {classKeys.length > 0 ? (
                                    <Icon
                                        style={{ marginRight: 10 }}
                                        className="dynamic-delete-button"
                                        type="minus-circle-o"
                                        onClick={() => classRemove(k)}
                                    />
                                ) : null}
                            </span>
                        </>
                    }
                    key={k}
                    style={{ marginTop: 0, marginBottom: 0 }}
                >
                    {selectedAlpha.map((alpha, alphaIndex) => (
                        <Form.Item
                            required={false}
                            key={'stimulus' + k + alpha}
                            style={{ display: 'inline-block', width: 'calc(100% - 12px)' }}
                        >
                            {getFieldDecorator(`stimulus${k}${alpha}`, {
                                initialValue: activeAllocatedTarget?.classes?.edges[k]?.node.stimuluses.edges[alphaIndex]?.node.stimulusName,
                                validateTrigger: ['onChange', 'onBlur'],
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: "Please input Stimulus's name or delete this field.",
                                    },
                                ],
                            })(
                                <Input placeholder={`Stimulus ` + `${alpha}`} />
                            )}

                        </Form.Item>

                    ))}


                    {/* {keys.length > 0 ? (
                    <Icon
                        style={{ marginRight: 10 }}
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null} */}

                </Form.Item>


            </>
        ));



        // end of equivalence class code


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

                    <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Daily Trials</span></>} style={{ marginTop: 0, marginBottom: 0 }}>

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
                    <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Consecutive Days</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
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
                        <Form.Item label={<><span style={{ color: 'red', fontSize: 10 }}>*</span><span>Peak Blocks</span></>} style={{ marginTop: 0, marginBottom: 0 }}>
                            <NumberCard
                                // title="Peak Blocks"
                                number={peakBlockCount}
                                maxValue={10}
                                setNumber={num => onChangeNumber('spbc', num)}
                                minValue={1}
                            />
                        </Form.Item>
                        <Form.Item label="Category">
                            {form.getFieldDecorator('category', {
                                initialValue: activeAllocatedTarget && capitalize(activeAllocatedTarget.peakType)
                            })(
                                <Select style={{ width: '100%' }} placeholder="Select a category" size="large">
                                    <Option key="1" value="Direct">
                                        Direct
                                    </Option>
                                    <Option key="2" value="Generalization">
                                        Generalization
                                    </Option>
                                    <Option key="3" value="Transformation">
                                        Transformation
                                    </Option>
                                    <Option key="4" value="Equivalance">
                                        Equivalance
                                    </Option>
                                </Select>,
                            )}
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

                    {equivalenceEnable || form.getFieldValue('category') === 'Equivalance' ?
                        <>
                            {classFormItems}
                            <Form.Item label="Add Classes">
                                <Button type="dashed" onClick={() => classAdd()} style={{ width: '100%' }}>
                                    <Icon type="plus" /> Add Class
                                </Button>
                            </Form.Item>
                        </>
                        :
                        <>
                            {formItems}
                            {form.getFieldValue('stepKeys')?.length > 0 ?
                                <Form.Item label="Add Stimulus">
                                    <Button type="dashed" disabled style={{ width: '60%' }}>
                                        <Icon type="plus" /> Add field
                                    </Button>
                                </Form.Item>
                                :
                                <Form.Item label="Add Stimulus">
                                    <Button type="dashed" onClick={add} style={{ width: '60%' }}>
                                        <Icon type="plus" /> Add field
                                    </Button>
                                </Form.Item>
                            }

                            {formItemsSteps}
                            {form.getFieldValue('keys')?.length > 0 ?
                                <Form.Item label="Add Steps">
                                    <Button type="dashed" disabled style={{ width: '60%' }}>
                                        <Icon type="plus" /> Add field
                                    </Button>
                                </Form.Item>
                                :
                                <Form.Item label="Add Steps">
                                    <Button type="dashed" onClick={addStep} style={{ width: '60%' }}>
                                        <Icon type="plus" /> Add field
                                    </Button>
                                </Form.Item>
                            }
                        </>
                    }

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
