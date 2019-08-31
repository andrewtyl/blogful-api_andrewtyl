# blogful-api_andrewtyl

8-30 / Andrew Jessen-Tyler / Databases with Express
This program will may not run properly on Windows.
Reccomended platform: Linux / Ubuntu

## Boilerplate

This is a boilerplate template for a new project. Additional details below.

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Open a terminal and cd to where you want the new project folder to be.
2. In terminal, run `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
3. In terminal, run `cd NEW-PROJECTS-NAME`
4. Delete `.git` folder using a file exploring program or run `rm -rf .git` in terminal.
5. In terminal, run `git init`
6. In terminal, run `npm i`
7. Rename `example.env` to `.env`
8. Edit `name`, `description`, and `repository` in `package.json`
9. Edit `version`, `author`, `keywords`, and `license` in `package.json` if needed.
10. Edit this file to include your app's name and description. It is reccomended to keep a backup of this file before altering it and add it to `.gitignore` or to reference the readme at `https://github.com/thinkful-ei-firefly/express-boilerplate_andrewtyl/blob/master/README.md` for additional information about Scripts and Deploying.

##Scripts

`npm start` starts the app.
`npm run dev` starts the app in nodemon.
`npm test` runs all tests in `./test/`.

## Deploying to Heroku

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

1. Ensure heroku is installed by running `heroku --version` in a terminal. If it is not installed please install it following `https://devcenter.heroku.com/articles/heroku-cli#download-and-install`
2. Ensure you are logged into heroku by running `heroku auth:whoami` in a terminal. If you are not logged in, please use `heroku login` or `heroku login -i` to login.
3. Double check project for sensitive information and change it accordingly prior to deployment.
4. Ensure the `./Procfile` is setup how you want it.
5. Ensure `./package.json` is setup properly, including the `engines` section.
6. Open a terminal at `./`, and run `npm run predeploy`. If there are any issues, run `npm audit --fix`.
7. Do a final commit to `git` and push to GitHub.
8. In the terminal at `./`, run `npm run deploy` to finish deployment.
9. In the terminal at `./`, run `heroku open` to see the deployed program.