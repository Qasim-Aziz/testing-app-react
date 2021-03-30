## Installation

###########################################################

# Test Edit

- Install latest node.js: https://nodejs.org​
- Install latest yarn package manager: https://yarnpkg.com/​
- Install node modules by running terminal command `yarn install`
- Run the app `yarn start`
- For build production files use `yarn build` (build to /build/ folder)

## Reference

[https://facebook.github.io/create-react-app/](https://facebook.github.io/create-react-app/)

## if you are facing error like missing env.js file

- then navigate to src folder and create env.js file and add this file

# for production

- export default 'https://application.cogniable.us/apis/graphql'

# for development

- export default 'https://development.cogniable.us/apis/graphql'

# Chinmay Dali Pull-Request [ReadMe]

1. I configured my package.json with "CHOKIDAR"
2. I configured my apolloClient for my local-django setup
3. Added my routes to the "leads"
4. I then went onto copying my component files/folders
5. Copied the State-Management
