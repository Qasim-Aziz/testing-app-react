import React from 'react'
import { Select } from 'antd'

const { Option } = Select

const Diagnosis = props => {
  const [children, setChildren] = React.useState([])

  //   React.useEffect(() => {
  //     mutateData()
  //   }, [children])

  //   const mutateData = () => {
  //     for (let i = 10; i < 36; i += 1) {
  //       children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
  //     }
  //   }

  const handleChange = value => {
    console.log(`selected ${value}`)
  }

  return (
    <Select mode="tags" style={{ width: '100%' }} placeholder="Tags Mode" onChange={handleChange}>
      {children}
    </Select>
  )
}

export default Diagnosis
