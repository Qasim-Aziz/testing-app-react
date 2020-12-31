/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */

import React from 'react'
import { Form, Input, Button, Select, Icon, Drawer } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/authorizationCodes/actions'
import AddModifier from './AddModifier'

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
}

// let id = 0

@connect(({ authorizationCode }) => ({ authorizationCode }))
class AddFeeSchedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = { visible: false, newCode: '', modifierRates: [] }
  }

  addModifierRate = modifier => {
    this.setState(prevState => ({
      modifierRates: [...prevState.modifierRates, modifier],
    }))
    console.log('modifierrates', this.state.modifierRates)
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  onCodeChange = event => {
    console.log('change event')
    this.setState({
      newCode: event.target.value,
    })
  }

  addCode = () => {
    console.log('addItem')
    this.setState({
      newCode: '',
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      console.log('values', values)
      values.modifierRates = this.state.modifierRates
      console.log('values', values)
      if (!error) {
        dispatch({
          type: actions.CREATE_FEE_SCHEDULE,
          payload: {
            values: values,
          },
        })
        this.props.closeDrawer()
        form.resetFields()
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  // remove = k => {
  //   const { form } = this.props
  //   const keys = form.getFieldValue('modifierRates')
  //   form.setFieldsValue({
  //     modifierRates: keys.filter(key => key !== k),
  //   })
  //   id--
  // }

  // add = () => {
  //   const { form } = this.props
  //   const keys = form.getFieldValue('modifier')
  //   const nextKeys = keys.concat(id++)
  //   form.setFieldsValue({
  //     modifierRates: nextKeys,
  //   })
  // }

  render() {
    const { form, codeList, payorList, modifiers } = this.props
    const itemStyle = { marginBottom: '5px' }
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { newCode } = this.state

    // getFieldDecorator('modifier', { initialValue: [] })
    // const keys = getFieldValue('modifier')
    // const formItems = keys.map((k, index) => (
    //   <>
    //     <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
    //       <Form.Item
    //         {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //         label={`Modifier ${k + 1}`}
    //         style={itemStyle}
    //         required={false}
    //         key={k}
    //       >
    //         {getFieldDecorator(`modifier`, {
    //           validateTrigger: ['onChange', 'onBlur'],
    //           rules: [
    //             {
    //               required: true,
    //               whitespace: true,
    //               message: 'Please input modifier details or delete this field.',
    //             },
    //           ],
    //         })(
    //           <Select size="small" placeholder="Select Modifier" style={{ width: '60%' }}>
    //             {modifiers.map(item => (
    //               <Select.Option key={item.id} value={item.id}>
    //                 {item.name}
    //               </Select.Option>
    //             ))}
    //           </Select>,
    //         )}
    //         {keys.length >= 1 ? (
    //           <Icon
    //             className="dynamic-delete-button"
    //             type="minus-circle-o"
    //             onClick={() => this.remove(k)}
    //           />
    //         ) : null}
    //       </Form.Item>
    //       <Form.Item label="Unit Rate" style={itemStyle} key={`rate[${k}]`}>
    //         {form.getFieldDecorator(`modifierRate`, { initialValue: '' })(
    //           <Input size="small" style={{ width: '60%' }} />,
    //         )}
    //       </Form.Item>
    //       <Form.Item label="Agreed Rate" style={itemStyle} key={`agreedRate[${k}]`}>
    //         {form.getFieldDecorator(`modifierAgreedRate`, { initialValue: '' })(
    //           <Input size="small" style={{ width: '60%' }} />,
    //         )}
    //       </Form.Item>
    //     </Form>
    //   </>
    // ))

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 4 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 20 },
    //   },
    // }
    // const formItemLayoutWithOutLabel = {
    //   wrapperCol: {
    //     xs: { span: 24, offset: 0 },
    //     sm: { span: 20, offset: 4 },
    //   },
    // }
    return (
      <>
        <Form {...layout} onSubmit={e => this.handleSubmit(e)}>
          <Form.Item label="Company/Payor" style={itemStyle}>
            {form.getFieldDecorator('payor', {
              rules: [{ required: true, message: 'Please provide name of Payor' }],
            })(
              <Select placeholder="Select Name" size="small" style={{ width: '60%' }}>
                {payorList.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.firstname}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Service Code" style={itemStyle}>
            {form.getFieldDecorator('code', {
              rules: [{ required: true, message: 'Please select Service code' }],
            })(
              <Select placeholder="Select Code" size="small" style={{ width: '60%' }}>
                {codeList.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.code}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Unit Rate" style={itemStyle}>
            {form.getFieldDecorator('rate', { initialValue: '' })(
              <Input size="small" style={{ width: '60%' }} />,
            )}
          </Form.Item>
          <Form.Item label="Agreed Rate" style={itemStyle}>
            {form.getFieldDecorator('agreedRate', { initialValue: '' })(
              <Input size="small" style={{ width: '60%' }} />,
            )}
            <Button type="dashed" onClick={this.showDrawer} style={{ marginLeft: '10px' }}>
              <Icon type="plus" /> Add Modifier
            </Button>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {/* <Button htmlType="primary" onClick={this.onReset} className="ml-4">
              cancel
            </Button> */}
          </Form.Item>
        </Form>

        <Drawer
          title="Add Modifier"
          width={350}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <AddModifier
            modifiers={modifiers}
            addModifierRate={this.addModifierRate}
            closeDrawer={this.onClose}
          />
        </Drawer>
      </>
    )
  }
}

export default Form.create()(AddFeeSchedule)
