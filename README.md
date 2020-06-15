# Adonis API + MySql + MongoDB

This is a virtual store API using mysql as database motor and the power of mongodb for geolocalization queries

## Before setting up out app

Remember to configure your .env file as the .env.example file. You must have mysql and mongodb installed on your machine or install it inside of your docker container

## Setup

Use the npm installation command to install automatically the dependencies of the project

```npm install```

Once your dependencies are up be sure to configure your database using the developed migrations

```adonis migration:run```

You can run the server using the adonis serve command

```adonis serve```

As development tool you can run the app using nodemon, to do this the command is previously configured in this way

```npm run dev```

## Making your own fake database

The API is developed to provide you a possibility to generate a fake database for tests and functional visualization. To populate your database run the below command

```adonis seed```

## Testing

Be sure of have your database populated before this tests. There are 31 tests developed for functionalities. Run the tests wit this command

```adonis test```
