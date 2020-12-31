import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import Header from './Header';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column',
    },
  },
  image: {
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: 'column',
    width: 170,
    paddingTop: 30,
    paddingRight: 15,
    '@media max-width: 400': {
      width: '100%',
      paddingRight: 0,
    },
    '@media orientation: landscape': {
      width: 200,
    },
  },
  footer: {
    fontSize: 12,
    fontFamily: 'Lato Bold',
    textAlign: 'center',
    marginTop: 25,
    paddingTop: 10,
    borderWidth: 3,
    borderColor: 'gray',
    borderStyle: 'dashed',
    '@media orientation: landscape': {
      marginTop: 10,
    },
  },
});

Font.register({
  family: 'Open Sans',
  src: `./dj_static/fonts/fonts/Open_Sans/OpenSans-Regular.ttf`,
});
Font.register({
  family: 'Lato',
  src: `./dj_static/fonts/fonts/Lato/Lato-Regular.ttf`,
});
Font.register({
  family: 'Lato Italic',
  src: `./dj_static/fonts/fonts/Lato//Lato-Italic.ttf`,
});
Font.register({
  family: 'Lato Bold',
  src: `./dj_static/fonts/fonts/Lato/Lato-Bold.ttf`,
});


const App = () => (
  <PDFViewer style={{width:1700, height:2000}}>
    <Document>
      <Page size="A4" style={styles.page}>
       <Header />
       <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Image
            src="https://application.cogniable.us/media/images/user.jpeg"
            style={styles.image}
          />
          <Education />
          <Skills />
        </View>
        <Experience />
      </View>
      <Text style={styles.footer}>This IS the candidate you are looking for</Text>
      </Page>
    </Document>
  </PDFViewer>
);

ReactDOM.render(<App />, document.getElementById('root'));
