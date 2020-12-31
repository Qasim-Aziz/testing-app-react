import React from 'react'
import { Helmet } from 'react-helmet'
import Authorize from 'components/LayoutComponents/Authorize'
import { Form, Steps, Button, Checkbox } from 'antd'

const { Step } = Steps

function onChange(checkedValues) {
  console.log('checked = ', checkedValues)
}

class otherSkill extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  onChange = current => {
    console.log('onChange:', current)
    this.setState({ current })
  }

  onChange(value) {
    console.log('changed', value)
    this.setState({})
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { current } = this.state
    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />

        <div className="row justify-content-md-center">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div>
                  <Steps current={current} onChange={this.onChange}>
                    <Step title="Step 1" description="Personal information" />
                    <Step title="Step 2" description="Medical History" />
                    <Step title="Step 3" description="Developmental" />
                    <Step title="Step 4" description="Pre-requisite skill assessment" />
                    <Step title="Step 5" description="Behaviours that challenge" />
                    <Step title="Step 6" description="Other skills" />
                    <Step title="Step 7" description="Preference Assessment" />
                  </Steps>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-8">
            <div className="card">
              <p
                style={{
                  fontSize: '25px',
                  textAlign: 'center',
                  backgroundColor: '#3956C4',
                  color: 'white',
                }}
              >
                Other skills
              </p>
              <div style={{ marginLeft: '5%' }}>
                <Form>
                  <Form.Item
                    label="Language skills of learner using Sign/word/PECS"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">The learner has no form of language</Checkbox>
                      <br />
                      <Checkbox value="2">Learner can vocalise sounds (baa,moo,oo etc)</Checkbox>
                      <br />
                      <Checkbox value="3">Learner can communicate needs in one word</Checkbox>
                      <br />
                      <Checkbox value="4">Learner can label objects in one word</Checkbox>
                      <br />
                      <Checkbox value="5">
                        Learner can communicate needs in two or more words
                      </Checkbox>
                      <br />
                      <Checkbox value="6">Learner can label objects in two or more words</Checkbox>
                      <br />
                      <Checkbox value="7">Learner can answer questions using a sentence</Checkbox>
                      <br />
                      <Checkbox value="8">
                        Learner can ask for information using a sentence
                      </Checkbox>
                      <br />
                      <Checkbox value="9">Learner can sustain a conversation</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Receptive Language skills of learner"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not follow any instructions</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Learner orients to/ locate sounds or instructions
                      </Checkbox>
                      <br />
                      <Checkbox value="3">Learner can follow simple one step instructions</Checkbox>
                      <br />
                      <Checkbox value="4">
                        Learner can follow complex one step instructions
                      </Checkbox>
                      <br />
                      <Checkbox value="5">Learner can follow two step instructions</Checkbox>
                      <br />
                      <Checkbox value="6">Learner can follow varied instructions</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner indulge in following play and leisure skills?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">
                        Child does not engage in play and leisure skills in a constructive and
                        correct manner
                      </Checkbox>
                      <br />
                      <Checkbox value="2">Constructive play</Checkbox>
                      <br />
                      <Checkbox value="3">
                        Use objects around the house for make-believe play
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Solve problems during play (like finding a fallen toy under the bed)
                      </Checkbox>
                      <br />
                      <Checkbox value="5">Pretend/ Imaginary play</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner interact in the following ways?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Learner plays alone</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Plays besides peers but does not indulge in play/activity with them
                        (parallel play)
                      </Checkbox>
                      <br />
                      <Checkbox value="3">Engages with 1-2 peers only</Checkbox>
                      <br />
                      <Checkbox value="4">Invites peers to join him in a game/activity</Checkbox>
                      <br />
                      <Checkbox value="5">
                        Chooses to join a group of children/peers who are playing near by for a
                        short period
                      </Checkbox>
                      <br />
                      <Checkbox value="6">Sustained plays with peers (for a longer time)</Checkbox>
                      <br />
                      <Checkbox value="7">Follows rules of games like Ludo or Chess</Checkbox>
                      <br />
                      <Checkbox value="8">
                        Engages in complex group games like Cricket or Basket ball
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="What are the gross motor skills of the learner?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Learner does not have gross motor skills</Checkbox>
                      <br />
                      <Checkbox value="2">Learner can sit without support</Checkbox>
                      <br />
                      <Checkbox value="3">Learner can move both hands and legs</Checkbox>
                      <br />
                      <Checkbox value="4">Learner can walk/scoot/crawl across the floor</Checkbox>
                      <br />
                      <Checkbox value="5">
                        Learner can run smoothly changing speed and direction
                      </Checkbox>
                      <br />
                      <Checkbox value="6">
                        Learner can climb up and come down the stairs alternating both feet
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="What are the fine motor skills of the learner?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Learner does not have fine motor skills</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Learner has basic fine motor skills (can move fingers and toes)
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        Learner has low level fine motor skills (clap, roll, and lift)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Learner has moderate level fine motor skills (can zip, pull and push door)
                      </Checkbox>
                      <br />
                      <Checkbox value="5">
                        Learner has advance level fine motor skills (cutting using scissors,
                        writing)
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner imitate other people's actions?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not imitate any action</Checkbox>
                      <br />
                      <Checkbox value="2">Imitates one motor action (clap hands)</Checkbox>
                      <br />
                      <Checkbox value="3">
                        Imitates two-step motor actions (clap hands and then jump)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Imitated one motor action with objects (throw ball)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Imitates two-step motor actions with objects (touch head and then throw the
                        ball)
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner imitate other people's sounds/words?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not imitate any sounds/words</Checkbox>
                      <br />
                      <Checkbox value="2">Imitates oral motor actions (tongue out)</Checkbox>
                      <br />
                      <Checkbox value="3">Imitates sounds (baa, oo, maa)</Checkbox>
                      <br />
                      <Checkbox value="4">Imitates one word</Checkbox>
                      <br />
                      <Checkbox value="5">Imitates two or more wor</Checkbox>
                      <br />
                      <Checkbox value="6">Imitates short sentences</Checkbox>
                      <br />
                      <Checkbox value="7">Imitates long sentences</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Mathematic skills of Learner"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">
                        Learner does not perform any level of mathematics
                      </Checkbox>
                      <br />
                      <Checkbox value="2">Learner can identify numbers from 1-10</Checkbox>
                      <br />
                      <Checkbox value="3">Learner can identify numbers from 10-20</Checkbox>
                      <br />
                      <Checkbox value="4">
                        Learner can identify all numbers according to his/her age after 20
                      </Checkbox>
                      <br />
                      <Checkbox value="5">Learner can count till 10</Checkbox>
                      <br />
                      <Checkbox value="6">Learner can count till 20</Checkbox>
                      <br />
                      <Checkbox value="7">Learner can count till 50</Checkbox>
                      <br />
                      <Checkbox value="8">Learner performs additions</Checkbox>
                      <br />
                      <Checkbox value="9">Learner performs subtractions</Checkbox>
                      <br />
                      <Checkbox value="10">Learner performs multiplications</Checkbox>
                      <br />
                      <Checkbox value="12">Learner performs divisions</Checkbox>
                      <br />
                      <Checkbox value="13">Learner performs mathematic tables</Checkbox>
                      <br />
                      <Checkbox value="14">Learner understands the concept of weight</Checkbox>
                      <br />
                      <Checkbox value="15">Learner understands the concept of height</Checkbox>
                      <br />
                      <Checkbox value="16">Learner understands the concept of distance</Checkbox>
                      <br />
                      <Checkbox value="17">
                        Learner understands the concept of space (full, empty)
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner read out the following?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">
                        Does not read or show interest towards others reading
                      </Checkbox>
                      <br />
                      <Checkbox value="2">Shows interest and attends to others reading</Checkbox>
                      <br />
                      <Checkbox value="3">1-10 phonemes</Checkbox>
                      <br />
                      <Checkbox value="4">11-26 phonemes</Checkbox>
                      <br />
                      <Checkbox value="5">1-10 letters</Checkbox>
                      <br />
                      <Checkbox value="6">11-26 letters</Checkbox>
                      <br />
                      <Checkbox value="7">Two letter words</Checkbox>
                      <br />
                      <Checkbox value="8">Three letter words</Checkbox>
                      <br />
                      <Checkbox value="9">Sentences consisting 3 words</Checkbox>
                      <br />
                      <Checkbox value="10">Sentences consisting 4 words</Checkbox>
                      <br />
                      <Checkbox value="11">Sentences consisting 5 words</Checkbox>
                      <br />
                      <Checkbox value="12">Sentences consisting more than 5 words</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner perform writing skills?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not perform any writing skills</Checkbox>
                      <br />
                      <Checkbox value="2">Can hold a pen/pencil with a proper grip</Checkbox>
                      <br />
                      <Checkbox value="3">Scribble</Checkbox>
                      <br />
                      <Checkbox value="4">Trace lines and shapes</Checkbox>
                      <br />
                      <Checkbox value="5">Trace letters</Checkbox>
                      <br />
                      <Checkbox value="6">Trace Numbers</Checkbox>
                      <br />
                      <Checkbox value="7">Write letters</Checkbox>
                      <br />
                      <Checkbox value="8">Write numbers</Checkbox>
                      <br />
                      <Checkbox value="9">Write words</Checkbox>
                      <br />
                      <Checkbox value="10">Write sentences</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner understand the following concepts of language?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not understand any concepts of language</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Understands basic antonyms (Big and small, day and night)
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        Understands complex antonyms (begin and finish, same and different)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">Singular and Plural</Checkbox>
                      <br />
                      <Checkbox value="5">Understands tense</Checkbox>
                      <br />
                      <Checkbox value="6">
                        Connects nouns and verb phrases (the dog licked my face)
                      </Checkbox>
                      <br />
                      <Checkbox value="7">Can summarise a short story in own word</Checkbox>
                      <br />
                      <Checkbox value="8">Understands analogies (busy as a bee)</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner perform these life skills?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not perform any life skill</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Eats and drink on his own (holds his milk bottle)
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        Eats different food textures (slimy food, soft food, vegetables)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">Pull off garments</Checkbox>
                      <br />
                      <Checkbox value="5">Pull clothes up (pants, socks)</Checkbox>
                      <br />
                      <Checkbox value="6">Puts clothes on (shirts, dress)</Checkbox>
                      <br />
                      <Checkbox value="7">Brushes hair and teeth</Checkbox>
                      <br />
                      <Checkbox value="8">Bathes regularly</Checkbox>
                      <br />
                      <Checkbox value="9">Unzip and unbutton</Checkbox>
                      <br />
                      <Checkbox value="10">Put on buttons and Zip up</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner performs these visual perception skills?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not perform any visual perception skill</Checkbox>
                      <br />
                      <Checkbox value="2">
                        Finds an object when its hidden in front of the learner
                      </Checkbox>
                      <br />
                      <Checkbox value="3">
                        Finds an object when its hidden (not in front of the learner)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">Matches identical objects to pictures</Checkbox>
                      <br />
                      <Checkbox value="5">Matches non identical objects to pictures</Checkbox>
                      <br />
                      <Checkbox value="6">sorts on the basis of shape</Checkbox>
                      <br />
                      <Checkbox value="7">sorts on the basis of size</Checkbox>
                      <br />
                      <Checkbox value="8">Sorts on the basis of Features (small, red)</Checkbox>
                      <br />
                      <Checkbox value="9">Solves two step sequence (A-B-A-?)</Checkbox>
                      <br />
                      <Checkbox value="10">Solves three step sequence (AB-AA-AC-AB-?)</Checkbox>
                      <br />
                      <Checkbox value="11">
                        Sorts on the basis of Function (knife and scissors)
                      </Checkbox>
                      <br />
                      <Checkbox value="12">
                        Sorts on the basis of Class( Vehicle, Vegetable, Animals)
                      </Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label="Does the learner follow classroom behaviours/routines?"
                    style={{ margin: '25px' }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Checkbox.Group style={{ width: '100%', fontSize: '25px' }} onChange={onChange}>
                      <Checkbox value="1">Does not follow classroom behaviours</Checkbox>
                      <br />
                      <Checkbox value="2">Sits in a group</Checkbox>
                      <br />
                      <Checkbox value="3">
                        Follows instructions in a group (discussion/ group work)
                      </Checkbox>
                      <br />
                      <Checkbox value="4">
                        Orients body and makes eye contact during a conversation with peers
                      </Checkbox>
                      <br />
                      <Checkbox value="5">
                        Shows appropriate affection towards peers (hugs, smiles)
                      </Checkbox>
                      <br />
                      <Checkbox value="6">Initiates an interaction</Checkbox>
                      <br />
                      <Checkbox value="7">
                        Plays age appropriate games with peers (hide and seek)
                      </Checkbox>
                      <br />
                      <Checkbox value="8">Interacts with people over phone/video calls</Checkbox>
                      <br />
                      <Checkbox value="9">Praises others</Checkbox>
                      <br />
                      <Checkbox value="10">Understands others emotions (angry, happy)</Checkbox>
                      <br />
                      <Checkbox value="11">
                        Respects others opinions (if it conflicts with his opinion)
                      </Checkbox>
                      <br />
                      <Checkbox value="12">Understands others intention (friendly, bully)</Checkbox>
                      <br />
                      <Checkbox value="12">Understands others interests</Checkbox>
                      <br />
                    </Checkbox.Group>
                  </Form.Item>

                  <div style={{ marginLeft: '40%' }}>
                    <Form.Item>
                      <Button type="submit" htmlType="submit">
                        Back
                      </Button>

                      <Button htmlType="primary" onClick={this.onReset} className="ml-4">
                        Next
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default otherSkill
