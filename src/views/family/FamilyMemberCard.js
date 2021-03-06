import React from 'react'
import { Button, Typography } from 'antd'
import { COLORS, FONT } from 'assets/styles/globalStyles'

const FamilyMemberCard = ({ onClick, heading, text, selected }) => {
  const { Text } = Typography
  let buttonStyle = {
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    width: '100%', // '100%',
    height: '50px', // '80px',
    margin: '12.5px 0',
    padding: '0 35px',
    borderRadius: '10px',
  }

  const buttonContent = {
    textAlign: 'left',
  }

  let headingStyle = {
    fontWeight: 'bold',
    fontSize: FONT.level2, // '22px',
    color: '#AAA',
  }

  // let textStyle = {
  //   fontSize: '20px',
  //   fontWeight: '500',
  //   color: '#E5E5E5',
  //   whiteSpace: 'pre-line',
  // }

  if (selected) {
    buttonStyle = {
      ...buttonStyle,
      backgroundColor: COLORS.palleteBlue, // '#E58425',
      color: '#fff',
    }

    headingStyle = {
      ...headingStyle,
      color: '#fff',
    }

    // textStyle = {
    //   ...textStyle,
    //   color: '#fff',
    // }
  }

  return (
    <Button style={buttonStyle} className="btnActive" onClick={onClick}>
      <div style={buttonContent}>
        <div>
          <Text style={headingStyle}>{heading}</Text>
        </div>
      </div>
    </Button>
  )
}

export default FamilyMemberCard

/*
<Button style={buttonStyle} className="btnActive" onClick={onClick}>
      <div style={buttonContent}>
        <div>
          <Text style={headingStyle}>{heading}</Text>
        </div>
      </div>
    </Button>
*/
