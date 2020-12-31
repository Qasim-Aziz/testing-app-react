import React from 'react';

import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Title from './Title';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  school: {
    fontFamily: 'Lato Bold',
    fontSize: 10,
  },
  degree: {
    fontFamily: 'Lato',
    fontSize: 10,
  },
  candidate: {
    fontFamily: 'Lato Italic',
    fontSize: 10,
  },
});

export default () => (
  <View style={styles.container}>
    <Title>Learner Details</Title>
    <Text style={styles.school}>Name : Ishita Chaturvedi</Text>
    <Text style={styles.degree}>Father Name : Chandan Chaturvedi</Text>
    <Text style={styles.candidate}>DOB : 18 March 2014</Text>
  </View>
);
