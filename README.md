# Drip Drop Api 

## Documentation

### Purpose

### Base URL

The base URL for the Drip Drop is: 
https://desolate-oasis-71104.herokuapp.com/api

### Authentication 

There is no authentication required to utilize the Drip Drop API. 

### Endpoints

#### auth 

Auth Endpoints: 
* POST /auth/login - Used for user login on Drip Drop client. In request body, required to pass 'email' and 'password'. Will respond with 400 status code if no user exists in drip_drop_users table. If user exists, will create and send jwt.

#### plants

Plants Endpoints: 
* GET /plants - No required or optional request data fields. Will return a serialized list of all plants in the drip_drop_plants table.
* POST /plants - Used to add a plant to the drip_drop_plants table. In request body, required to pass 'name', 'water_every', 'watering_directions', and 'img'. Will respond with 400 status code if any of the required fields are missing. If all fields are provided, will respond with 201 status code and the added plant.

#### reminders

Reminders Endpoints:
* GET /reminders - No required or optional request data fields. Will return a serialized list of all reminders in the drip_drop_reminders table.
* POST /reminders - Used to add a reminder to the drip_drop_reminders table. In request body, required to pass 'plant_id', 'user_id', and 'remind_on'. Will respond with 400 status code if any of the required fields are missing. If all fields are provided, will respond with 201 status code and the added reminder.
* GET /reminders/users/:user_id - Used to return plant information based on the reminders attached to the user. Required to pass user_id in the query string. Will return a list of serialized plants for the user whose user id was passed in the query string. 
* PATCH /reminders/:reminder_id 
* DELETE /reminders/plants/:plant_id/users/:user_id 

#### sms

SMS Endpoints: 
* GET /sms 

#### users

Users Endpoints:
* GET /users
* POST /users 






he root path for this version of your API
Authentication and other headers required with each request
The path to call each endpoint
Which HTTP methods can be used with each endpoint
The request data fields and where each goes, such as path, query-string, or body
Explanation of what request data is required and what is optional
Which HTTP status codes are possible for each endpoint/method pairing
What each status code means in the context of each call
The data to expect in each response, including which responses will always be present
Example request and response data


# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.