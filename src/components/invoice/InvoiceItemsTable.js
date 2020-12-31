/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import React from 'react'

import 'antd/dist/antd.css'
import './index.css'

import { Table, Input, Button, Popconfirm, Form, Select, Typography } from 'antd'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const FormItem = Form.Item
const EditableContext = React.createContext()

const { Option } = Select
const { Text } = Typography

const PRODUCTS = gql`
  query {
    invoiceProductsList {
      id
      name
    }
  }
`

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form} key={index}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

// class EditableCell extends React.Component {
//   constructor(props, context) {
//     super(props, context)
//     this.state = {
//       editing: true,
//     }
//   }

//   componentDidMount() {
//     if (this.props.editable) {
//       document.addEventListener('click', this.handleClickOutside, true)
//     }
//   }

//   componentWillUnmount() {
//     if (this.props.editable) {
//       document.removeEventListener('click', this.handleClickOutside, true)
//     }
//   }

//   // 2. ES6 auto binding this
//   toggleEdit = () => {
//     const editing = !this.state.editing
//     this.setState(
//       {
//         editing,
//       },
//       () => {
//         // callback
//         if (editing) {
//           this.input.focus()
//         }
//       },
//     )
//   }

//   handleClickOutside = e => {
//     const { editing } = this.state
//     if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
//       this.save()
//     }
//   }

//   save = () => {
//     const { record, handleSave } = this.props
//     this.form.validateFields((error, values) => {
//       if (error) {
//         return
//       }
//       this.toggleEdit()
//       handleSave({
//         ...record,
//         ...values,
//       })
//     })
//   }

//   render() {
//     const { editing } = this.state
//     const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props
//     return (

//       <td ref={node => (this.cell = node)} {...restProps}>
//         {editable ? (
//           <EditableContext.Consumer>
//             {form => {
//               this.form = form
//               return editing ? (
//                 <>
//                   {dataIndex !== 'service' ? (
//                     <FormItem style={{ margin: 0 }}>
//                       {form.getFieldDecorator(dataIndex, {
//                         rules: [
//                           {
//                             required: true,
//                             message: `${title} is required.`,
//                           },
//                         ],
//                         initialValue: record[dataIndex],
//                       })(
//                         <Input
//                           type="Number"
//                           placeholder={`Type the ${dataIndex}`}
//                           min={0}
//                           ref={node => (this.input = node)}
//                           onPressEnter={this.save}
//                         />,
//                       )}
//                     </FormItem>
//                   ) : (
//                     <Query query={PRODUCTS}>
//                       {({ loading, error, data }) => {
//                         if (error) return `Error! ${error}`
//                         return (
//                           <FormItem style={{ margin: 0 }}>
//                             {form.getFieldDecorator(dataIndex, {
//                               rules: [
//                                 {
//                                   required: true,
//                                   message: `${title} is required.`,
//                                 },
//                               ],
//                             })(
//                               <Select
//                                 loading={loading}
//                                 placeholder="Select a Product"
//                                 ref={node => (this.input = node)}
//                                 onPressEnter={this.save}
//                               >
//                                 {data?.invoiceProductsList.map(product => {
//                                   return (
//                                     <Option key={product.id} value={product.name}>
//                                       {product.name}
//                                     </Option>
//                                   )
//                                 })}
//                               </Select>,
//                             )}
//                           </FormItem>
//                         )
//                       }}
//                     </Query>
//                   )}
//                 </>
//               ) : (
//                 <div
//                   className="editable-cell-value-wrap"
//                   style={{ paddingRight: 24, minHeight: 30 }}
//                   onClick={this.toggleEdit}
//                 >
//                   {restProps.children}
//                 </div>
//               )
//             }}
//           </EditableContext.Consumer>
        
//         ) : (
//           restProps.children
//         )}
//       </td>
//     )
//   }
// }

class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [
      {
        title: '#',
        dataIndex: 'key',
        width: '10%',
      },
      {
        title: 'Product/Service',
        dataIndex: 'service',
        editable: true,
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        editable: true,
      },
      {
        title: 'Rate',
        dataIndex: 'rate',
        editable: true,
      },
      {
        title: 'Amount',
        render: (text, record) => {
          console.log(record)
          return parseFloat(record.qty) * parseFloat(record.rate)
        },
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.props.dataSource.length >= 1 ? (
            <Popconfirm
              // 3. Array Function bind this
              onConfirm={() => this.handleDelete(record.key)}
              title="Sure to delete?"
            >
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          ) : null,
      },
    ]
    this.state = {
      count: 2,
    }
  }

  handleDelete = key => {
    const dataSource = [...this.props.dataSource]
    this.props.setDataSource(dataSource.filter(item => item.key !== key))
  }
  handleAdd = () => {
    const { count } = this.state
    const { dataSource } = this.props
    const newData = {
      key: count,
      service: '',
      qty: 1,
      rate: '',
    }
    this.props.setDataSource([...dataSource, newData])
    this.setState({
      count: count + 1,
    })
  }

  handleSave = row => {
    const newData = [...this.props.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.props.setDataSource(newData)
  }

  handleCleanAll = () => {
    this.props.setDataSource([
      {
        key: 1,
        service: '',
        qty: 1,
        rate: 0,
      },
    ])
    this.setState({
      count: 1,
    })
  }

  render() {
    const { dataSource } = this.props
    const components = {
      body: {
        row: EditableFormRow,
        // cell: EditableCell,
      },
    }
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      }
    })
    return (
      <div>
        <Table
          components={components}
          columns={columns}
          dataSource={dataSource}
          bordered
          rowClassName={() => 'editable-row'}
          pagination={false}
          footer={() => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button onClick={this.handleAdd} type="primary">
                Add a Line
              </Button>

              <Button onClick={this.handleCleanAll} type="primary" style={{ marginLeft: 20 }}>
                Clean All Line
              </Button>

              <Button onClick={this.handleAdd} type="primary" style={{ marginLeft: 20 }}>
                Add Subtotal
              </Button>

              <Text
                style={{
                  marginLeft: 'auto',
                  marginRight: '10%',
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Subtotal
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 600 }}>{this.props.totalAmount}$</Text>
            </div>
          )}
        />
      </div>
    )
  }
}

export default EditableTable
