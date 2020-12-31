/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, notification } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

const { Text } = Typography

const SEND_ANSWER = gql`
  mutation($masterID: ID!, $areaID: ID!, $selected: ID!, $dbQuestionNumber: Int!, $code: String!) {
    vbmappSubmitResponse(
      input: {
        master: $masterID
        area: $areaID
        group: $selected
        question: $dbQuestionNumber
        code: $code
        score: 0.00
      }
    ) {
      total
      details {
        id
        questionNum
        score
        date
        groups {
          id
          groupName
        }
      }
    }
  }
`

const EachSkillCheckBox = ({ skill, sendRes, checked, setReportRe }) => {
  const [skillChecked, setSkillChecked] = useState(checked)

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
      <Checkbox
        id={skill.id}
        style={{
          width: 40,
          height: 40,
          marginRight: -40,
          marginTop: 0,
          opacity: 0,
          zIndex: 1000,
        }}
        checked={skillChecked}
        onChange={() => {
          setReportRe(true)
          sendRes({
            variables: {
              code: skill.id,
            },
          })
          setSkillChecked(state => !state)
        }}
      />
      <div
        style={{
          width: 40,
          height: 40,
          display: 'inline',
          borderRadius: 5,
          border: '1px solid #eee',
          background: skillChecked ? 'green' : '#fff',
        }}
      ></div>
      <label htmlFor={skill.id} style={{ fontSize: 18, marginLeft: 10 }}>
        <span style={{ fontWeight: '700' }}>{skill.id} : </span>
        <Text>{ReactHtmlParser(skill.skill)}</Text>
      </label>
    </div>
  )
}

export default ({
  currentQuestion,
  masterId,
  group,
  questionNo,
  prevRecord,
  refatch,
  reportLoading,
  setReportRe,
}) => {
  const [sendRes, { data, error, loading }] = useMutation(SEND_ANSWER, {
    variables: {
      masterID: masterId,
      areaID: 'VmJtYXBwQXJlYTo1',
      selected: group,
      dbQuestionNumber: questionNo,
    },
  })

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Failed to record talk skill',
      })
    }
    if (data) {
      refatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data])

  if (loading || reportLoading) {
    return <h5>Saving...</h5>
  }
  console.log(currentQuestion)
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      {currentQuestion.skills.map(skill => {
        const prevChecked = prevRecord.find(({ code }) => code === skill.id)
        return (
          <EachSkillCheckBox
            setReportRe={setReportRe}
            key={skill.id}
            skill={skill}
            checked={prevChecked}
            sendRes={sendRes}
          />
        )
      })}
    </div>
  )
}
