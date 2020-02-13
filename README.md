# Drip Drop API

## Documentation

### Use

The Drip Drop API was built for use with drip-drop-client ([repo](https://github.com/WadeMegan/drip-drop)/[live app](https://build-zeta.now.sh/)) and drip-drop-send-sms ([repo](https://github.com/WadeMegan/drip-drop-send-sms)). 

### Base URL

The base URL for the Drip Drop API is: 
https://desolate-oasis-71104.herokuapp.com/api

### Authentication 

There is no authentication required to utilize the Drip Drop API. 

### Endpoints

#### Auth Endpoints 

* POST /auth/login - Used for user login on Drip Drop client. In request body, required to pass 'email' and 'password'. Will respond with 400 status code if no user exists in drip_drop_users table. If user exists, will create and send jwt.

#### Plants Endpoints

* GET /plants - No required or optional request data fields. Will return a serialized list of all plants in the drip_drop_plants table.
* POST /plants - Used to add a plant to the drip_drop_plants table. In request body, required to pass 'name', 'water_every', 'watering_directions', and 'img'. Will respond with 400 status code if any of the required fields are missing. If all fields are provided, will respond with 201 status code and the added plant.

#### Reminders Endpoints

* GET /reminders - No required or optional request data fields. Will return a serialized list of all reminders in the drip_drop_reminders table. 
* POST /reminders - Used to add a reminder to the drip_drop_reminders table. In request body, required to pass 'plant_id', 'user_id', and 'remind_on'. Will respond with 400 status code if any of the required fields are missing. If all fields are provided, will respond with 201 status code and the added reminder.
* GET /reminders/users/:user_id - Used to return plant information based on the reminders attached to the user. Required to pass user_id in the query string. Will return a list of serialized plants for the user whose user id was passed in the query string. 
* PATCH /reminders/:reminder_id - Used to update the reminder specified in the query string. Required to pass reminder_id in the query string. In request body, must pass at least one of 'plant_id', 'user_id' or 'remind_on'. Will respond with 400 status code if none of the fields are passed. If at least one of the fields are provided, will respond with 204 status code and will update the reminder's field(s).
* DELETE /reminders/plants/:plant_id/users/:user_id - Used to delete reminders based on user_id and plant_id. Required to pass both plant_id and user_id in the query string. Will respond with 200 status code and delete the reminder that has matching user_id and plant_id.

#### SMS Endpoints

* GET /sms - No required or optional request data fields. Goes through all data in drip_drop_reminders and joins it with data from drip_drop_plants and drip_drop_users to return information necessary to send sms messages via Twilio. This includes reminder id, plant name, plant water_every, user phone_number, and reminder remind_on. Responds with the list of serialized sms's.

#### Users Endpoints

* GET /users - No required or optional request data fields. Will return a serialized list of all users in the drip_drop_users table.
* POST /users - Used to add a user to the drip_drop_users table. In request body, required to pass 'first_name', 'last_name', 'password', 'email', and 'phone_number'. Will respond with 400 status code if any of the required fields are missing. If all fields are provided, will respond with 201 status code and the added user.

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## The Drip Drop Project

## Live App

A live version of the app can be accessed [here]().

To demo Drip Drop, log in with:
* Email: test@gmail.com
* Password: password

## Summary

Drip Drop is a web application that reminds users to water their houseplants. Users can select the plants they have from a list of common houseplants. Each day, Drip Drop will check to see if any of the user's plants will need to be watered. If so, Drip Drop will send the user a sms message as a reminder. The goal of Drip Drop is to make it easier for users to remember when they should be watering their plants, in order to prevent fewer houseplant deaths caused by over or under watering.

### Technologies Used

#### Front End: 
* ReactJS
* jQuery
* HTML
* CSS

#### Back End: 
* Node.js
* Express
* PostgreSQL

#### APIs:
* Twilio
