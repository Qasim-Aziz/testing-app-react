import React from 'react'
import { Form, Input, Button, Select, Divider, Icon, Row, Col, Upload } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/payor/actions'
import { getResponsibilities } from 'components/PayorsAndBilling/Common/utils'

const { TextArea } = Input
@connect(({ payor }) => ({ payor }))
class AddPayor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { fileList: [] }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: actions.GET_PAYOR_CONTACT_TYPE,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, closeDrawer } = this.props
    const { fileList } = this.state

    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.CREATE_PAYOR,
          payload: {
            values,
            fileList,
          },
        })
        closeDrawer()
        form.resetFields()
      }
    })
  }

  onReset = () => {
    const { form } = this.props
    form.resetFields()
  }

  render() {
    const { form, contactTypes, payorPlans } = this.props
    const { fileList } = this.state

    const uploadDragerProps = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }))
        return false
      },
      fileList,
    }

    return (
      <Form className="addOrEditPayor" onSubmit={this.handleSubmit}>
        <Divider orientation="left">Basic Details</Divider>
        {/* First Name - Last Name */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="First Name" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('firstname', {
                initialValue: '',
                rules: [{ required: true, message: 'Please provide your first name' }],
              })(<Input placeholder="Enter First Name" />)}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Last Name" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('lastname', { initialValue: '' })(
                <Input placeholder="Enter Last Name" />,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Email */}
        <Row>
          <Col span={24}>
            <Form.Item label="Email" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('email', {
                rules: [{ required: true, type: 'email', message: 'Please provide your email' }],
              })(<Input placeholder="Enter Email id" />)}
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Row>
          <Col span={24}>
            <Form.Item label="Description" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('description', { initialValue: '' })(
                <TextArea placeholder="Description..." autoSize={{ minRows: 3 }} />,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Contract Details</Divider>

        {/* Payor Plan */}
        <Row>
          <Col span={24}>
            <Form.Item label="Payor Plan" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              {form.getFieldDecorator('payorPlan', {
                rules: [{ required: true, message: 'Please provide your Payor Plan' }],
              })(
                <Select
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  optionFilterProp="children"
                  placeholder="Select Payor Plan"
                  allowClear
                >
                  {payorPlans.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {`${item.company.name} - ${item.plan}`}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Contract Type - Respnsibility */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Contact Name" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('contactType', {
                rules: [{ required: true, message: 'Please provide your Contact name' }],
              })(
                <Select placeholder="Select Contract Type">
                  {contactTypes.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Responsibility" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('responsibility')(
                <Select placeholder="Select Responsibility">
                  {getResponsibilities().map(item => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* State - City */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="State" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('state', { initialValue: '' })(
                <Input placeholder="Enter State name" />,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="City" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('city', { initialValue: '' })(
                <Input placeholder="Enter City name" />,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Primary Location */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Primary Location" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('primaryLocation', { initialValue: '' })(
                <Input placeholder="Enter Primary Location" />,
              )}
            </Form.Item>
          </Col>
        </Row>

        {/* Home phone - Work phone */}
        <Row>
          <Col sm={24} md={12}>
            <Form.Item label="Home Phone" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('homePhone', { initialValue: '' })(
                <Input placeholder="Enter Home Phone" />,
              )}
            </Form.Item>
          </Col>
          <Col sm={24} md={12}>
            <Form.Item label="Work Phone" labelCol={{ sm: 8 }} wrapperCol={{ sm: 16 }}>
              {form.getFieldDecorator('workPhone', { initialValue: '' })(
                <Input placeholder="Enter Work Phone" />,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Upload Documents</Divider>
        {/* File Dragger */}
        <Row>
          <Col span={24}>
            <Form.Item>
              <Upload.Dragger multiple {...uploadDragerProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>

        {/* Buttons */}
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={this.onReset} className="ml-4">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(AddPayor)
