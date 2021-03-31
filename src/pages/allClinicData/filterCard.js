/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable prefer-destructuring */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Select, Input, Form } from 'antd'
import { FORM } from 'assets/styles/globalStyles'

const { layout } = FORM

export const FilterCard = forwardRef((props, ref) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [mobile, setMobile] = useState('')
  const [designation, setDesignation] = useState('')
  const [gender, setGender] = useState('')

  useImperativeHandle(ref, () => ({
    clearFilter() {
      setName('')
      setEmail('')
      setStatus('')
      setMobile('')
      setDesignation('')
      setGender('')
      console.log('inm in clear')
      props.filterHandler({})
    },
  }))

  const handleFilter = e => {
    const tempName = e.target.name
    const value = e.target.value
    switch (tempName) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'mobile':
        setMobile(value)
        break
      case 'designation':
        setDesignation(value)
        break
      default:
        break
    }
    props.filterHandler({
      name: tempName === 'name' ? value : name,
      email: tempName === 'email' ? value : email,
      status,
      mobile: tempName === 'mobile' ? value : mobile,
      designation: tempName === 'designation' ? value : designation,
      gender,
    })
  }

  const handleSelect = (value, stName) => {
    switch (stName) {
      case 'status':
        setStatus(value)
        break
      case 'gender':
        setGender(value)
        break
      default:
        break
    }
    props.filterHandler({
      name,
      email,
      status: stName === 'status' ? value : status,
      mobile,
      designation,
      gender: stName === 'gender' ? value : gender,
    })
  }

  const customStyle = {
    fontSize: '17px',
    color: '#000',
    marginRight: '12px',
    marginBottom: '12px',
  }

  const inputCustom = { width: '180px', display: 'block' }

  return (
    <div>
      {props.filterSet.name && (
        <Form.Item {...layout} label="Name">
          <Input name="name" placeholder="Search Name" value={name} onChange={handleFilter} />
        </Form.Item>
      )}
      {props.filterSet.email && (
        <Form.Item {...layout} label="Email">
          <Input name="email" placeholder="Search Email" value={email} onChange={handleFilter} />
        </Form.Item>
      )}
      {props.filterSet.mobile && (
        <Form.Item {...layout} label="Mobile">
          <Input
            name="mobile"
            placeholder="Search Mobile"
            type="number"
            value={mobile}
            onChange={handleFilter}
          />
        </Form.Item>
      )}
      {props.filterSet.designation && (
        <Form.Item {...layout} label="Designation">
          <Input
            name="designation"
            placeholder="Search Designation"
            type="text"
            value={designation}
            onChange={handleFilter}
          />
        </Form.Item>
      )}
      {props.filterSet.status && (
        <Form.Item {...layout} label="Status">
          <Select
            name="status"
            value={status}
            style={inputCustom}
            onSelect={value => handleSelect(value, 'status')}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="true">Active</Select.Option>
            <Select.Option value="false">Inactive</Select.Option>
          </Select>
        </Form.Item>
      )}
      {props.filterSet.gender && (
        <Form.Item {...layout} label="Gender">
          <Select
            name="gender"
            style={inputCustom}
            value={gender}
            onSelect={value => handleSelect(value, 'gender')}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
      )}
    </div>
  )
})

// export default FilterCard
