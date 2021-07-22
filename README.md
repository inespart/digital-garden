# Digital Garden

## Deployed version

You can visit the deployed website here: [Digital Garden](https://digitalgarden-knowledge-base.herokuapp.com/)

This web application was created as the final project for the Upleveled bootcamp in Vienna.

## Idea & Functionalities

## Technologies

- Next.js
- React.js
- PostgreSQL
- Emotion
- Typescript
- Jest
- Cypress

## Project Management

- Database schema created with DrawSQL: [See schema](https://drawsql.app/final-project/diagrams/final-project#)

![Database Structure](./public/screenshot_database.png)

- Task management with Trello

![Trello TODOs](./public/screenshot_trello.png)

- Wireframing and design with Figma

![Design with Figma](./public/screenshot_figma.png)

## SetUp instructions

To work on this project by yourself, please follow the upcoming steps:

- Clone the repo to your local machine with `git clone <repo>`
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Create a new file .env
- Copy the environment variables from .env-example into .env
- Replace the placeholders xxxxx with your username, password and name of database
- Install dotenv-cli with `yarn global add dotenv-cli`
- Run `yarn install` in your command line
- Run the migrations with `yarn migrate up`
- Start the server by running `yarn dev`

## Deploy your own website to Heroku

The easiest way to deploy your Next.js app is to use Heroku.

- Sign up for Heroku: [signup.heroku.com](signup.heroku.com)
- Create a new App
- Choose a name and select the "Europe" Region
- Click on the button in the middle called "Connect to GitHub"
- Search for your repository in the search box at the bottom of the page and click on the "Connect" button Click on the button for "Enable Automatic Deploys"
- Go back to the Overview tab and click on "Configure Add-On"
- Search for "Postgres" and select "Heroku Postgres" from the results
- Trigger a deploy by pushing your repo to GitHub
