## Installation ##
###########################################################
# Test Edit ##
* Install latest node.js: https://nodejs.org​
* Install latest yarn package manager: https://yarnpkg.com/​
* Install node modules by running terminal command `yarn install`
* Run the app `yarn start`
* For build production files use `yarn build` (build to /build/ folder)

## Reference ##

[https://facebook.github.io/create-react-app/](https://facebook.github.io/create-react-app/)


## if you are facing error like missing env.js file 

* then navigate to src folder and create env.js file and add this file 
# for production 
* export default 'https://application.cogniable.us/apis/graphql'
# for development 
* export default 'https://development.cogniable.us/apis/graphql'