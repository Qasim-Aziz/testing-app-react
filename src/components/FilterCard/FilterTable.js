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
import { Select, Input } from 'antd'
import './filterTable.scss'

export const FilterCard = forwardRef((props, ref) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [mobile, setMobile] = useState('')
  const [designation, setDesignation] = useState('')
  const [gender, setGender] = useState('')
  const [caseMngr, setCaseMngr] = useState('')
  const [address, setAddress] = useState('')

  useImperativeHandle(ref, () => ({
    clearFilter() {
      setName('')
      setEmail('')
      setStatus('')
      setMobile('')
      setDesignation('')
      setGender('')
      setCaseMngr('')
      setAddress('')
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
      case 'address':
        setAddress(value)
        break
      case 'caseMngr':
        setCaseMngr(value)
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
      caseMngr: tempName === 'caseMngr' ? value : caseMngr,
      address: tempName === 'address' ? value : address,
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
      caseMngr,
      address,
    })
  }

  const customStyle = {
    fontSize: '17px',
    color: '#000',
    margin: '2px 12px 8px 0',
  }

  const inputCustom = { width: '180px', marginBottom: '8px', display: 'block' }

  return (
    <div>
      {props.filterSet.name && (
        <div className="filter_sub_div">
          <span style={customStyle}>Name :</span>
          <Input
            size="default"
            name="name"
            placeholder="Search Name"
            value={name}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
      {props.filterSet.email && (
        <div className="filter_sub_div">
          <span style={customStyle}>Email :</span>
          <Input
            size="default"
            name="email"
            placeholder="Search Email"
            value={email}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
      {props.filterSet.mobile && (
        <div className="filter_sub_div">
          <span style={customStyle}>Mobile :</span>
          <Input
            size="default"
            name="mobile"
            placeholder="Search Mobile"
            type="number"
            value={mobile}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
      {props.filterSet.designation && (
        <div className="filter_sub_div">
          <span style={customStyle}>Designation :</span>
          <Input
            size="default"
            name="designation"
            placeholder="Search Designation"
            type="text"
            value={designation}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
      {props.filterSet.status && (
        <div className="filter_sub_div">
          <span style={customStyle}>Status :</span>
          <Select
            size="default"
            name="status"
            value={status}
            onSelect={value => handleSelect(value, 'status')}
            style={inputCustom}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="true">Active</Select.Option>
            <Select.Option value="false">Inactive</Select.Option>
          </Select>
        </div>
      )}
      {props.filterSet.gender && (
        <div className="filter_sub_div">
          <span style={customStyle}>Gender :</span>
          <Select
            size="default"
            name="gender"
            value={gender}
            onSelect={value => handleSelect(value, 'gender')}
            style={inputCustom}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </div>
      )}
      {props.filterSet.address && (
        <div className="filter_sub_div">
          <span style={customStyle}>Address :</span>
          <Input
            size="default"
            name="address"
            placeholder="Search Address"
            type="text"
            value={address}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
      {props.filterSet.caseMngr && (
        <div className="filter_sub_div">
          <span style={customStyle}>Case Manager :</span>
          <Input
            size="default"
            name="caseMngr"
            placeholder="Case Manager"
            type="text"
            value={caseMngr}
            onChange={handleFilter}
            style={inputCustom}
          />
        </div>
      )}
    </div>
  )
})

// export default FilterCard
