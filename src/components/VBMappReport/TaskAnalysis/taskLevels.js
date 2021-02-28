const taskLevels = [
  { groupName: 'Mand', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'Tact', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'Listener', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'VP/MTS', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'Play', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'Social', isInLevel1: true, isInLevel2: true, isInLevel3: true },
  { groupName: 'Imitation', isInLevel1: true, isInLevel2: true, isInLevel3: false },
  { groupName: 'Echoic', isInLevel1: true, isInLevel2: true, isInLevel3: false },
  { groupName: 'Vocal', isInLevel1: true, isInLevel2: false, isInLevel3: false },
  { groupName: 'LRFFC', isInLevel1: false, isInLevel2: true, isInLevel3: false },
  { groupName: 'IV', isInLevel1: false, isInLevel2: true, isInLevel3: false },
  { groupName: 'Group', isInLevel1: false, isInLevel2: true, isInLevel3: true },
  { groupName: 'Linguistics', isInLevel1: false, isInLevel2: true, isInLevel3: true },
  { groupName: 'Math', isInLevel1: false, isInLevel2: false, isInLevel3: true },
  { groupName: 'Reading', isInLevel1: false, isInLevel2: false, isInLevel3: true },
  { groupName: 'Writing', isInLevel1: false, isInLevel2: false, isInLevel3: true },
]

export const levels = {
  1: {
    level: 1,
    questions: [5, 4, 3, 2, 1],
  },
  2: {
    level: 2,
    questions: [10, 9, 8, 7, 6],
  },
  3: {
    level: 3,
    questions: [15, 14, 13, 12, 11],
  },
}

export default taskLevels
