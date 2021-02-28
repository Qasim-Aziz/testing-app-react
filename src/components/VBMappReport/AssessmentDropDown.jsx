import React, { useState } from 'react'
import { Select, Form } from 'antd'
import { useQuery } from 'react-apollo'
import moment from 'moment'

const { Option } = Select

const AssessmentDropDown = ({ form, onSelectionChange, assessmentData, isAssessmentLoading }) => {
  const [selectedAssessment, setSelectedAssessment] = useState()

  const handleSelectionChange = selectedItem => {
    setSelectedAssessment(selectedItem)
    if (onSelectionChange) onSelectionChange(selectedItem)
  }

  return (
    <Form.Item label="Select an assessment" style={{ display: 'flex' }}>
      {form.getFieldDecorator('stdId', {
        initialValue: assessmentData && assessmentData?.vbmappGetAssessments?.edges[0]?.node?.id,
      })(
        <Select
          showSearch
          style={{ width: 200 }}
          optionFilterProp="testNo"
          placeholder="Select an assessment"
          loading={isAssessmentLoading}
          onChange={handleSelectionChange}
          filterOption={(input, option) =>
            String(option.props.children[0]) === input || option.props.children[2] === input
          }
        >
          {assessmentData?.vbmappGetAssessments?.edges.map(({ node }) => {
            return (
              <Option key={node.id} value={node.id}>
                {node.testNo} - {moment(node.date).format('YYYY-MM-DD')}
              </Option>
            )
          })}
        </Select>,
      )}
    </Form.Item>
  )
}

export default Form.create()(AssessmentDropDown)
