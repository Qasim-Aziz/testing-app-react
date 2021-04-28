/* eslint-disable no-plusplus */
import { Table } from 'antd'
import React from 'react'

const AllFilesData = () => {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Upload',
      dataIndex: 'upload',
    },
  ]

  const data = []
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      id: i,
      fileName: `London, Park Lane no. ${i}`,
      labels: i,
      size: `${i + 30} KB`,
      upload: `Edward King ${i}`,
    })
  }
  // useEffect(() => {

  // }, [data])
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // // state = {
  // //     selectedRowKeys: [], // Check here to configure the default column
  // //   };
  //  const onSelectChange = rowKeys => {
  //     console.log('selectedRowKeys changed: ', rowKeys);
  //     setSelectedRowKeys(rowKeys);
  //   };
  // const rowSelection = {
  //     selectedRowKeys,
  //     onChange: onSelectChange,
  //     selections: [
  //       Table.SELECTION_ALL,
  //       Table.SELECTION_INVERT,
  //       Table.SELECTION_NONE,
  //       {
  //         key: 'odd',
  //         text: 'Select Odd Row',
  //         onSelect: changableRowKeys => {
  //           let newSelectedRowKeys = [];
  //           newSelectedRowKeys = changableRowKeys.filter((key, index) => {
  //             if (index % 2 !== 0) {
  //               return false;
  //             }
  //             return true;
  //           });
  //           setSelectedRowKeys(newSelectedRowKeys);
  //         },
  //       },
  //       {
  //         key: 'even',
  //         text: 'Select Even Row',
  //         onSelect: changableRowKeys => {
  //           let newSelectedRowKeys = [];
  //           newSelectedRowKeys = changableRowKeys.filter((key, index) => {
  //             if (index % 2 !== 0) {
  //               return true;
  //             }
  //             return false;
  //           });
  //           setSelectedRowKeys(newSelectedRowKeys);
  //         },
  //       },
  //     ],
  // }

  return (
    <>
      <div className="all_files_data_container">
        <Table bordered columns={columns} dataSource={data} />
      </div>
    </>
  )
}

export default AllFilesData
