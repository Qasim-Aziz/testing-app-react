import React from 'react'
import { Button, Progress, Card, Typography} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { COLORS } from 'assets/styles/globalStyles'
import { arrayNotNull, notNull, capitalize } from '../../utilities'
import styles from './style.module.scss'


const { Title, Text } = Typography

const GoalCard = ({
  heading = '',
  progess = '0',
  onEdit,
  selectShortTermGoal,
  selected,
  editAble,
  status
}) => {
  let headingStyle = {}
  let selectedCardStyle = {backgroundColor: COLORS.palleteLight}

  if (selected) {
    headingStyle = {
      color: '#fff',
    }
    selectedCardStyle = {
      // border: '2px solid #1c94fd',
      backgroundColor: COLORS.palleteLightBlue
    }
  }
  return (
    // <Card style={{ width: '100%', padding: 0 }} bodyStyle={{padding: 0}}>
    <Button className={styles.card} style={selectedCardStyle} onClick={selectShortTermGoal}>
      {editAble && (
        <div className={styles.longTermGoalEditBn}>
          <span style={{ marginRight: '20px', fontSize: '14px' }}>{status}</span>
          <Button onClick={onEdit}><EditOutlined /> ST Goal</Button>
        </div>
      )}
      <div>
        <Title
          style={{
            color: '#000',
            fontSize: 14,
            lineHeight: '25px',
            display: 'inline',
            margin: 0,
            fontWeight: '500',
          }}
        >
          {capitalize(heading)}
        </Title>
        {/* <span className={styles.heading} style={headingStyle}>
          
        </span> */}
      </div>
      {/* <div>
        <Progress
          type="line"
          percent={progess}
          showInfo={false}
          strokeWidth={8}
          strokeColor={selected ? '#000 ' : '#007acc'}
        />
      </div> */}
    </Button>
    // </Card>
  )
}

export default GoalCard
