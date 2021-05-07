/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/destructuring-assignment */
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Table } from 'antd'
import 'antd/dist/antd.css'
import React from 'react'
import { PrescriptionFormContext } from './context'
import './index.scss'
import PrescriptionItemCell from './prescriptionItemCell'

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

const PrescriptionItemTable = ({ products, dispatch, totalAmount, ...props }) => {
  const columnsList = [
    {
      title: '#',
      dataIndex: 'key',
      width: 20,
    },
    {
      title: 'Med Type', // MedicineType
      editable: true,
      dataIndex: 'medicineType', // ::before 'type',
      width: 160,
    },
    {
      title: 'Name', // Name
      editable: true,
      dataIndex: 'name', // name // ::before service
      align: 'left',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      editable: true,
      width: 130,
      align: 'right',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      editable: true,
      width: 130,
      align: 'right',
    },
    {
      title: 'When',
      dataIndex: 'when',
      editable: true,
      width: 130,
      align: 'right',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      editable: true,
      align: 'right',
      width: 130,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      editable: true,
      width: 130,
      align: 'right',
    },

    {
      title: 'Qty',
      dataIndex: 'qty',
      width: 130,
      editable: true,
      align: 'right',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: 110,
      render: (
        text,
        { key, ...val }, // key, id, ...val
      ) => (
        <>
          {props.tryingTodelete ? (
            <>
              {val.pk ? (
                <>
                  <Button
                    className="remove_btn"
                    type="danger"
                    onClick={() => {
                      // Remove the row from the table
                      dispatch({
                        type: 'REMOVE_PRODUCT',
                        payload: { key },
                      })
                      console.log('TRYING TO REMOVE🚀🚀🚀🚀🚀🚀', val.pk)
                      props.setDeleteProduct(arr => [...arr, val.pk])
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </>
              ) : (
                <Button
                  className="remove_btn"
                  style={{ backgroundColor: '#ffbb33' }}
                  onClick={() => {
                    dispatch({
                      type: 'REMOVE_PRODUCT',
                      payload: { key },
                    })
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              )}
            </>
          ) : (
            <Button
              className="remove_btn"
              type="danger"
              onClick={() => {
                dispatch({
                  type: 'REMOVE_PRODUCT',
                  payload: { key },
                })
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )}
        </>
      ),
    },
  ]

  const handleAdd = () => {
    const newProductData = {
      key: products.length + 1,
      medicineType: 'SYP',
      name: 'Med',
      rate: 0,
      dosage: 0,
      unit: 0,
      when: 'morning',
      frequency: 0,
      duration: 10,
      qty: 1,
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
    <div style={{ margin: '5px auto 18px' }}>
      <Table
        components={components}
        columns={columns}
        dataSource={products}
        bordered
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
