import React, { Component } from 'react'
import { Card } from 'antd'

class Target extends Component {
  render() {
    const { Meta } = Card
    let progress = ['#FF9C52', '#4BAEA0', '#FF8080', '0', '0', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <span
            style={{
              height: '15px',
              display: 'inline-block',
              lineHeight: '12px',
              width: '20px',
              border: '1px solid #F5F5F5',
              backgroundColor: data,
              paddingLeft: '20px',
              borderRadius: '2px',
              marginRight: '5px',
            }}
          >
            &nbsp;
          </span>
        )
      }
      return null
    }, {})

    let cardBox = [1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 0, 0, 12, 34, 5, 5]
    cardBox = cardBox.map((data, index) => {
      if (data) {
        if (index === 0) {
          return (
            <Card
              hoverable
              style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}
              cover={
                <img
                  alt="example"
                  src="https://www.familyeducation.com/sites/default/files/2019-03/traits-babies-inherit-from-their-father_feature.jpg"
                  style={{ height: '150px' }}
                />
              }
            >
              <Meta
                title="Kunal names the music  category by listing "
                description="visual perfaction - 5 traol per day"
              />
              <div>{progress}</div>
            </Card>
          )
        }
        return (
          <Card hoverable style={{ width: '100%', maxHeight: '350px', marginBottom: '20px' }}>
            <Meta
              title="Kunal names the music  category by listing "
              description="visual perfaction - 5 traol per day"
            />
            <div>{progress}</div>
          </Card>
        )
      }
      return null
    })
    return cardBox
  }
}
export default Target
