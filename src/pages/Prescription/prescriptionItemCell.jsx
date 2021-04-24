/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable */

import { Form, Input, Select } from 'antd'
import 'antd/dist/antd.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { PrescriptionFormContext } from './context'
import './index.scss'

/**[Explanation]
 * This component will decide each item inside each cell of the entire table
 * record ==> each row in the entire table is a record
 * children ==>❗❗❗❗❗
 * title ==> title of the columnList; which is defined in the "prescriptionItemTable"
 * dataIndex ==> dataIndex of the columnList; which is defined in the "prescriptionItemTable"
 * handleSave ==> is a reducer function which save all the edits made in the local reducer of the component
 */
export default ({ record, children, title, editable, dataIndex, handleSave, ...restProps }) => {
  // console.log('RECORD', record)
  // console.log('CHILDREN', children)
  // console.log('TITLE', title)
  // console.log('EDITABLE', editable)
  // console.log('THE DATA INDEX', dataIndex)
  // console.log('THE HANDLESAVE', handleSave)
  // console.log('THE REST OF PROPS', restProps)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef()
  const form = useContext(PrescriptionFormContext)
  // console.log('THE LOCAL STATE of prescriptionItemCell', editing)
  // console.log('THE inputRef', inputRef)

  // useEffect(() => {
  //   console.log('THE USE EFFECT ☑☑☑☑☑☑☑☑☑☑☑☑☑🚀🚀🚀🚀🚀')
  //   console.log('CHECK HOW THE COMPONENT MOUNTS', title)
  // }, [])
  console.log('record', record)
  useEffect(() => {
    if (editing) {
      // console.log('THE inputRef inside useEffect', inputRef)

      if (inputRef.current) {
        // console.log('THE inputRef inside useEffect >>>>>>', inputRef.current.focus())
        inputRef.current.focus()
      }
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
    console.log(form.setFieldsValue)
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      // console.log('Save failed:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    childNode = editing ? (
      <div>
        {/* We have 7 fields the table column
            Here we are defining what kind of input field each column will take
         */}
        {/* the medicine-Name field will be called "service" in the array object */}
        {title === 'Product/Service' && (
          <Form.Item
            style={{
              margin: 0,
              border: 'none',
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('name', {
              //::before service
              initialValue: record.name, //::before record.service,
              rules: [
                {
                  required: true,
                  message: 'Please enter prescription name',
                },
              ],
            })(
              <Input
                ref={inputRef}
                // loading={false}
                placeholder="Please enter prescription name"
                onPressEnter={save}
                onBlur={save}
                style={{ border: 'none', width: '200px' }}
              />,
            )}
          </Form.Item>
        )}
        {/* In the column of MedicineType we need to display a selector field */}
        {title === 'Type' ? (
          <Form.Item
            style={{
              margin: 0,
              padding: 0,
            }}
            name={record.dataIndex}
          >
            {form.getFieldDecorator('medicineType', {
              initialValue: record.medicineType,
            })(
              <Select placeholder="Medicine Type" allowClear onSelect={save}>
                <Select.Option value="SYP">SYP</Select.Option>
                <Select.Option value="TAB">TAB</Select.Option>
                <Select.Option value="DRP">DRP</Select.Option>
                <Select.Option value="LIQ">LIQ</Select.Option>
              </Select>,
            )}
          </Form.Item>
        ) : (
          title !== 'Product/Service' && (
            <Form.Item
              style={{
                margin: 0,
                padding: 0,
              }}
              name={record.dataIndex}
            >
              {form.getFieldDecorator(title.toLowerCase())(
                <Input
                  ref={inputRef}
                  // loading={false}
                  placeholder="Please enter the values"
                  onPressEnter={save}
                  onBlur={save}
                  style={{ border: 'none', width: '200px' }}
                />,
              )}
            </Form.Item>
          )
        )}
      </div>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 0,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
