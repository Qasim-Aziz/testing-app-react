import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Form, Input, Checkbox } from 'antd'
import Authorize from '../LayoutComponents/Authorize'
// import style from '../learnerform.scss'

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
]

class LearnerForm extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    divShow: false,
    selectedName: '',
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    })
  }

  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    })
  }

  // logic for div show or hide
  divShowHide = () => {
    this.setState({ divShow: true })
  }

  consoleValue = (e, text) => {
    e.preventDefault()
    this.setState({
      selectedName: text,
      divShow: true,
    })
  }

  onFinish = values => {
    console.log('Received values of form: ', values)
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => (
          <a
            onClick={e => this.consoleValue(e, name)}
            onKeyPress={e => this.consoleValue(e, name)}
            role="button"
            tabIndex="0"
          >
            {name}
          </a>
        ),

        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
        sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        filters: [
          { text: 'London', value: 'London' },
          { text: 'New York', value: 'New York' },
        ],
        filteredValue: filteredInfo.address || null,
        onFilter: (value, record) => record.address.includes(value),
        sorter: (a, b) => a.address.length - b.address.length,
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
        ellipsis: true,
      },
    ]
    const { divShow } = this.state
    const divClass = divShow ? 'col-sm-8' : 'col-sm-12'
    const detailsDiv = divShow ? { display: 'inline-block' } : { display: 'none' }
    // const {Column} = Table;
    const { selectedName } = this.state
    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Partner" />
        {/* <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Responsive Tables</strong>
        </div> */}
        <div className="row">
          <div className={divClass}>
            <div className="card">
              <div className="card-body">
                <div className="table-operations" style={{ marginBottom: '16px' }}>
                  {/* <Button style={{marginRight: '8px'}} onClick={this.divShowHide}>Show</Button> */}
                  <Button style={{ marginRight: '8px' }} onClick={this.setAgeSort}>
                    Sort age
                  </Button>
                  <Button style={{ marginRight: '8px' }} onClick={this.clearFilters}>
                    Clear filters
                  </Button>
                  <Button style={{ marginRight: '8px' }} onClick={this.clearAll}>
                    Clear filters and sorters
                  </Button>
                </div>
                <Table columns={columns} dataSource={data} onChange={this.handleChange} />
              </div>
            </div>
          </div>
          <div className="col-sm-4" style={detailsDiv}>
            <div className="card">
              <div className="card-body">
                <div className="table-operations" style={{ marginBottom: '16px' }}>
                  <Button
                    style={{
                      marginRight: '-12px',
                      float: 'right',
                      border: 'none',
                      padding: 'none',
                    }}
                    onClick={() => this.setState({ divShow: false })}
                  >
                    X
                  </Button>
                </div>
                <div>
                  <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                  >
                    <Form.Item
                      name="username"
                      rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                      <Input value={selectedName} />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                      <Input type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default LearnerForm
