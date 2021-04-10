/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Table, Button, Form } from 'antd'
import PrescriptionItemCell from './prescriptionItemCell'
import './index.scss'
import { PrescriptionFormContext } from './context'

const EditableRow = ({ form, index, ...props }) => (
  <PrescriptionFormContext.Provider value={form} key={index}>
    {/* {console.log('THE FORM⏩⏩⏩⏩', form, index, props)} */}
    <tr {...props} />
  </PrescriptionFormContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const components = {
  body: {
    row: EditableFormRow,
    cell: PrescriptionItemCell,
  },
}

const PrescriptionItemTable = ({ products, dispatch, totalAmount }) => {
  // console.log('THE PRODUCTS', products)
  // console.log('THE Dispatch', dispatch)
  // console.log('THE TOTAL AMOUNT', totalAmount)
  const columnsList = [
    {
      title: '#',
      dataIndex: 'key',
      // width: 5,
    },
    {
      title: 'Type', // MedicineType
      editable: true,
      dataIndex: 'medicineType', // ::before 'type',
      // width: 20,
    },
    {
      title: 'Product/Service', // Name
      editable: true,
      dataIndex: 'name', // name // ::before service
      // width: 180,
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      editable: true,
      // width: 70,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      editable: true,
      // width: 70,
    },
    {
      title: 'When',
      dataIndex: 'when',
      editable: true,
      // width: 70,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      editable: true,
      // width: 70,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      editable: true,
      // width: 100,
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      // width: 10,
      editable: true,
      // render: (text, record) => {
      //   return parseFloat(record.qty) * parseFloat(record.rate)
      // },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      editable: true,
      width: 70,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 50,
      render: (text, { key }) => (
        <Button
          type="danger"
          onClick={() => {
            dispatch({
              type: 'REMOVE_PRODUCT',
              payload: { key },
            })
          }}
        >
          Delete
        </Button>
      ),
    },
  ]

  const handleAdd = () => {
    const newProductData = {
      key: products.length + 1,
      name: '', // ::before service: '',
      // qty: 1,
      rate: 0,
    }
    dispatch({ type: 'ADD_PRODUCT', payload: newProductData })
  }

  const handleSave = data => {
    dispatch({ type: 'EDIT_PRODUCT', payload: data })
  }

  const columns = columnsList.map(col => {
    // console.log('THE COL', col)
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
        handleSave,
      }),
    }
  })

  return (
    <div>
      <Table
        components={components}
        columns={columns}
        dataSource={products}
        bordered
        width="710px"
        rowClassName={() => 'editable-row'}
        pagination={false}
        loading={false}
        footer={() => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button onClick={handleAdd} type="primary">
              Add a Line
            </Button>
          </div>
        )}
      />
    </div>
  )
}

export default PrescriptionItemTable
