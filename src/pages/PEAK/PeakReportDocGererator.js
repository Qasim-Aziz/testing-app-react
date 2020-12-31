/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-useless-concat */

import React from 'react'
import { Popover } from 'antd'
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TabStopPosition, TabStopType, TextRun } from "docx";
import { saveAs } from "file-saver"


class PeakReportDocGenerator extends React.Component {
    state = {
        loading: false,
    }

    createDocFunction = () => {        
        const document = new Document();
        const learnerName = '##'
        const documentTitle =  `${learnerName}` +` Peak Report`
        const documentDate = '10/10/1996'
        const FLSfactorScore = 0
        const FLStypicalAgeGroup = 0
        const PLSfactorScore = 0
        const PLStypicalAgeGroup = 0
        const VCSfactorScore = 0
        const VCStypicalAgeGroup = 0
        const VRMMSfactorScore = 0
        const VRMMStypicalAgeGroup = 0

        const contentP1 = `\n Evaluation Overview: As part of a comprehensive assessment of `+ `${learnerName}` +`, the PEAK Relational Training System-Direct Training (PEAK-DT) Assessment (Dixon, 2014) was conducted.  This empirically supported assessment allows for an evaluation of the existence of, and deficits in, a wide variety of functional, cognitive, and language abilities.The results of this assessment indicate that `+ `${learnerName}` +` maintains appropriate eye contact, engages in sharing and turn taking, has basic imitation skills, and can follow basic instructions.  `+ `${learnerName}` +` makes requests 
        for things she wants/needs and demonstrates a preference for things she likes.  She will request a break from a task and she will ask for items that are not in the room.  She has some difficulty with vocal volume imitation. `+ `${learnerName}` +` is able to match pictures and items and can write letters and numbers after hearing them. This current set of skills within `+ `${learnerName}` +` repertoire is equivalent to a typically developing child of age 4-5.Deficits in functioning are found among the areas of, verbal 
        reasoning, memory and math skills. She had difficulty labeling and sorting items by class and feature. She had difficulty counting items past ten, working simple addition and subtraction problems.  She had difficulty answering questions about a story, rhyming words, and answering personal information questions, such as address, and phone number.`

        const contentP2 = `Using the PEAK-DT’s four factors listed below, we are able to quantitatively compare `+ `${learnerName}` +`  to a typical developing peer group and determine the degree of difference from such peers.  Foundational Learning Skills measure basic instruction following, modeled responding, and attention to the environment.  `+ `${learnerName}` +`’s factor score was `+`${FLSfactorScore}` +`, and deviates from her typical age group by `+`${FLStypicalAgeGroup}` +`.  Perceptual Learning Skills 
        measures basic cognitive abilities such as matching, finding objects from an array, naming/signing items, completing basic wh questions.  `+ `${learnerName}` +`’s factor score was `+`${PLSfactorScore}` +`, and deviates from her typical age group by `+`${PLStypicalAgeGroup}` +`. Verbal Comprehension Skills measures more complex verbal abilities such as multiple-step instruction following, multi-word vocal/signing utterances, beginning concept formations, and social exchanges.  
        `+ `${learnerName}` +`’s factor score was `+`${VCSfactorScore}` +`, and deviates from her typical age group by `+`${VCStypicalAgeGroup}` +`.  Finally, Verbal Reasoning, Memory, and Mathematic Skills measures basic logic processes, advanced cognitive abilities needed for effective social behavior, complex language, and beginning mathematical computation skills.  Mari’s factor score was `+`${VRMMSfactorScore}` +`, and deviates from her typical age group by `+`${VRMMStypicalAgeGroup}` +`.  A summary table is provided below for easy reference.  
        `

        document.addSection({
            children: [
                new Paragraph({
                    text: documentTitle,
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: documentDate,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),  
                new Paragraph(
                    contentP1
                ),
                new Paragraph(
                    contentP2
                ),
                
            ],
        });

        // document.addSection({
        //     children: [
                
                
        //     ],
        // });

        Packer.toBlob(document).then(blob => {
            console.log(blob);
            saveAs(blob, "example.docx");
            console.log("Document created successfully");
        });
    }

    render() {
        // const {

        // } = this.props



        return (
            <div style={{ width: '100%', alignSelf: 'center' }}>
                {this.createDocFunction()}
            </div>
        )
    }
}

export default PeakReportDocGenerator
