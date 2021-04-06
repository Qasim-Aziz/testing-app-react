/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Table, Button, Form, Typography, notification, Input, Modal } from 'antd'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import PrescriptionItemCell from './prescriptionItemCell'
import './index.scss'
import { PrescriptionFormContext } from './context'
// import { CREATE_PRODUCT } from './query'

const { TextArea } = Input

const { Text } = Typography

const EditableRow = ({ form, index, ...props }) => (
  <PrescriptionFormContext.Provider value={form} key={index}>
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
  const columnsList = [
    {
      title: '#',
      dataIndex: 'key',
      width: 10,
    },
    {
      title: 'Type',
      editable: true,
      dataIndex: 'type',
      width: 50,
    },
    {
      title: 'Product/Service',
      editable: true,
      dataIndex: 'service',
      width: 180,
    },
    {
      title: 'Dose',
      dataIndex: 'dose',
      editable: true,
      width: 70,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      editable: true,
      width: 70,
    },
    {
      title: 'When',
      dataIndex: 'when',
      editable: true,
      width: 70,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      editable: true,
      width: 70,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      editable: true,
      width: 70,
    },

    {
      title: 'Qty',
      width: 100,
      render: (text, record) => {
        return parseFloat(record.qty) * parseFloat(record.rate)
      },
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
      service: '',
      qty: 1,
      rate: 0,
    }
    dispatch({ type: 'ADD_PRODUCT', payload: newProductData })
  }

  const handleSave = data => {
    dispatch({ type: 'EDIT_PRODUCT', payload: data })
  }

  const columns = columnsList.map(col => {
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

  console.log(products, 'tableData')

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
