import React from 'react'
import { Row, Col } from 'antd'

const StudentAndTestDetails = ({ scoreDetails, studentDetails }) => (
  <Row className="studentAndScoreDetails">
    <Col sm={24} md={12}>
      <table cellSpacing="0">
        <tbody>
          <tr>
            <th>Child&apos;s Name:</th>
            <td colSpan={studentDetails.ageAtTest.length}>{studentDetails.name}</td>
          </tr>
          <tr>
            <th>Date of Birth:</th>
            <td colSpan={studentDetails.ageAtTest.length}>{studentDetails.dob}</td>
          </tr>
          <tr>
            <th>Age at Testing</th>
            {studentDetails.ageAtTest.map(age => (
              <td key={age.id} style={{ minWidth: '50px' }}>
                {age.text}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Col>
    <Col sm={24} md={12}>
      <table cellSpacing="0">
        <tbody>
          <tr>
            <th>Key:</th>
            <th>Score</th>
            <th>Date</th>
            <th>Color</th>
            <th>Tester</th>
          </tr>
          {scoreDetails.map(testDetails => (
            <tr key={testDetails.key}>
              <th>{testDetails.testTitle}</th>
              <td>{testDetails.score}</td>
              <td>{testDetails.date}</td>
              <td>
                <span className="colorBlock" style={{ backgroundColor: testDetails.color }} />
              </td>
              <td>{testDetails.tester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Col>
  </Row>
)

export default StudentAndTestDetails
