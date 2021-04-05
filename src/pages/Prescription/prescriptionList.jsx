/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Input, Button, Table } from 'antd'

export default props => {
  const data = props.data
  console.log('THE DATA', props)

  // const filterHandler = ({ name, email }) => {
  //   let filteredList = learnerState.mainData
  //   let tempFilterActive = false

  //   console.log('clinic filter', name, email)
  //   console.log(filteredList)
  //   if (!name && !email && !mobile && !gender && !caseMngr && !address) {
  //     tempFilterActive = false
  //   }
  //   if (name) {
  //     tempFilterActive = true
  //     filteredList =
  //       filteredList &&
  //       filteredList.filter(
  //         item =>
  //           item.firstname?.toLowerCase().includes(name.toLowerCase()) ||
  //           item.lastname?.toLowerCase().includes(name.toLowerCase()),
  //       )
  //   }
  //   if (email) {
  //     tempFilterActive = true
  //     filteredList =
  //       filteredList &&
  //       filteredList.filter(
  //         item => item.email && item.email.toLowerCase().includes(email.toLowerCase()),
  //       )
  //   }
  // }

  const columns = [
    {
      title: '#',
      render: row => data.indexOf(row) + 1,
    },
    {
      title: 'Name',
      dataIndex: 'firstname',
      sortable: true,
      render: (text, row) => (
        <Button
          type="link"
          onClick={() => {
            // this.setState({ showProfile: true })
            // this.info(row)
            console.log('CLICKED')
          }}
          style={{ padding: '0px', fontWeight: 'bold', fontSize: '14px' }}
        >
          {row.firstname} {row.lastname}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      render: (text, row) => <span>{row.email ? row.email : ''}</span>,
    },
    {
      title: 'Contact No',
      dataIndex: 'mobileno',
    },
  ]

  // const tableHeader = (
  //   <div
  //     style={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       position: 'relative',
  //       whiteSpace: 'nowrap',
  //       zIndex: 2,
  //       height: '28px',
  //       width: '100%',
  //       padding: '4px 12px',
  //     }}
  //   >
  //     <span style={{ display: 'flex', alignItems: 'center' }}>
  //       <span>Name :</span>
  //       <Input
  //         size="small"
  //         name="name"
  //         placeholder="Search Name"
  //         value={learnerState.filterName}
  //         onChange={e => {
  //           console.log(e.target.value, 'value')
  //           setLearnerState({
  //             filterName: e.target.value,
  //           })
  //           filterHandler({ name: e.target.value })
  //         }}
  //         style={{ width: '112px' }} //  ...tableFilterStyles,
  //       />
  //     </span>

  //     <span style={{ display: 'flex', alignItems: 'center' }}>
  //       <span>Email :</span>
  //       <Input
  //         size="small"
  //         name="name"
  //         placeholder="Search Email"
  //         value={learnerState.filterEmail}
  //         onChange={e => {
  //           setLearnerState({
  //             filterEmail: e.target.value,
  //           })
  //           filterHandler({ email: e.target.value })
  //         }}
  //         style={{ width: '148px' }} // ...tableFilterStyles,
  //       />
  //     </span>
  //   </div>
  // )

  return (
    <>
      <div style={{ marginBottom: '50px' }}>
        <div className="view_asset">
          <Table
            // title={() => {
            //   return tableHeader
            // }}
            columns={columns}
            rowKey={record => record.id}
            dataSource={data}
            // loading={loadingAssets} // this.state.loadingAssets
            // ⭐ The below commented code is for pagination from server side
            /* pagination={{
                   defaultPageSize: 20,
                   onChange: (page, rows) => this.pageChanged(page, rows),
                   onShowSizeChange: (currentPage, currentRowsPerPage) =>
                   this.rowsChanged(currentRowsPerPage, currentPage),
                   showSizeChanger: true,
                   pageSizeOptions:
                     TotalLeaders > 100
                       ? ['20', '50', '80', '100', `${TotalLeaders}`]
                       : ['20', '50', '80', '100'],
                   position: 'bottom',
                  }}
            */
          />
        </div>
      </div>
    </>
  )
}
