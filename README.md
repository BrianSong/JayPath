# 2020-spring-group-JayPath

This application has been deployed online: https://master.d2w70sft0n5zlh.amplifyapp.com/

## Install Node and NPM

If you haven't have Node.js and NPM installed on your computer:

1. Go to https://nodejs.org/en/download/.
2. Follow the installation instructions.
3. Verify that you have node installed by typing `node -v` in a command prompt.
   You can also refer to https://phoenixnap.com/kb/install-node-js-npm-on-windows to see more detailed instructions.

## Dependencies

After cloning our project, first go to the ./express folder. This is our express.js backend.

1. Try `npm install` first. This should install all dependencies specified in package.json.
2. Try `node index.js`. If it's running correctly, the console will display 'Listening on port 5000'.
3. If there are errors, please check that all packages have been installed by looking into the ./express/node_modules folder. You can install missing packages manually by `npm i <packagename>`.

The same procedure applies to the ./client folder, which is where the React.js frontend locates. The only difference is that you need to use `npm start` to start the frontend.

Note: The errors that are the most likely to be encountered are sqlite3 or react-scripts are missing. If that's the case you can run `npm i react-scripts`, `npm i react-autosuggest` in ./client and `npm i sqlite3` in ./express.
