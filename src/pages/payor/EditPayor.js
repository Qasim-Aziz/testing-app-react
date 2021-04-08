import React from 'react'
import { Form, Input, Button, Select, Switch, Divider, Icon, Row, Col, Upload } from 'antd'
import { connect } from 'react-redux'
import { FORM, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import actions from 'redux/payor/actions'
import { getResponsibilities } from 'components/PayorsAndBilling/Common/utils'

const { TextArea } = Input
const { layout, tailLayout } = FORM

@connect(({ payor }) => ({ payor }))
class EditPayor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { fileList: [], defaultFileList: [] }
  }

  componentDidMount() {
    const { form, payorProfile } = this.props

    form.setFieldsValue({
      firstname: payorProfile?.firstname,
      lastname: payorProfile?.lastname,
      email: payorProfile?.email,
      description: payorProfile?.description,
      contactType: payorProfile?.contactType.id,
      street: payorProfile?.street,
      city: payorProfile?.city,
      state: payorProfile?.state,
      primaryLocation: payorProfile?.primaryLocation,
      homePhone: payorProfile?.homePhone,
      workPhone: payorProfile?.workPhone,
      responsibility: payorProfile?.responsibility
        ? payorProfile?.responsibility?.charAt(0)?.toUpperCase() +
          payorProfile?.responsibility?.slice(1)?.toLowerCase()
        : null,
      payorPlan: payorProfile?.plan?.id,
    })

    const defaultFileList = payorProfile?.docs.edges.map(({ node }, index) => ({
      uid: index,
      name: node.file.substring(node.file.lastIndexOf('/') + 1),
      status: 'done',
      url: node.file,
    }))

    this.setState({
      defaultFileList,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form, dispatch, payorProfile, closeDrawer } = this.props
    const { fileList } = this.state

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: actions.EDIT_PAYOR,
          payload: {
            id: payorProfile.id,
            values,
            fileList,
          },
        })
        closeDrawer()
        form.resetFields()
      }
    })
  }

  payorActiveInactive = checked => {
    const { dispatch, payorProfile, closeDrawer } = this.props
    dispatch({
      type: actions.PAYOR_ACTIVE_INACTIVE,
      payload: {
        id: payorProfile.id,
        isActive: checked,
      },
    })
    closeDrawer()
    payorProfile.isActive = checked
  }

  render() {
    const { form, contactTypes, payorProfile, payorPlans } = this.props
    const { fileList, defaultFileList } = this.state

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
      showDownloadIcon: true,
      fileList: [...fileList, ...defaultFileList],
    }

    if (!payorProfile) return <h3>An error occurred to load payor&apos;s details</h3>

    return (
      <Form {...layout} className="addOrEditPayor" onSubmit={this.handleSubmit}>
        <Divider orientation="left">Payor Status</Divider>
        <Row>
          <Col span={24}>
            <Form.Item label="Status" labelCol={{ sm: 4 }} wrapperCol={{ sm: 20 }}>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={payorProfile.isActive}
                onChange={this.payorActiveInactive}
              />
            </Form.Item>
          </Col>
        </Row>

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
            <Form.Item {...tailLayout}>
              <Upload.Dragger {...uploadDragerProps} showUploadList>
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
            Save
          </Button>
          <Button onClick={this.onReset} style={CANCEL_BUTTON}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(EditPayor)
