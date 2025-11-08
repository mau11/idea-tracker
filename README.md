# Idea Tracker

> Log in to create lists of ideas and track their status.

## Table of Contents

1. [Tech Stack](#tech-stack)
1. [Requirements](#requirements)
1. [Development](#development)
   1. [Installing Dependencies](#installing-dependencies)
   1. [Running the Server](#running-the-server)
1. [View Application](#view-application)
1. [Deployment](#Deployment)

## Tech Stack

- **JavaScript**
- **CSS**
- **EJS**
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **Render**

## Requirements

- Node v24.2.0
- pnpm v10.6.2

## Development

#### Setting up Database

Setup up a [MongoDB Atlas account](https://www.mongodb.com/). Create a new database called `idea_tracker` with the collections: `users`, `ideas`, and `lists`.

#### Environment Variables

Run the command below to copy environment variables from the example, then add your values and save.

```sh
$ cp .env.example .env
```

| Environment Variable | Notes                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | port number (default: 3000)                                                                                                                           |
| DB_CONNECTION_STRING | MongoDB connection string in the format: `mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority` |
| DB_NAME              | MongoDB database name                                                                                                                                 |
| DB_CLUSTER_NAME      | MongoDB Atlas cluster name                                                                                                                            |
| SESSION_SECRET       | Any randomly generated text to be used for hashing credentials                                                                                        |

#### Installing Dependencies

```sh
$ nvm use
$ pnpm install
```

#### Running the Server

Once dependencies are installed, run the following command to start the development server:

```sh
$ pnpm dev
```

## View Application

For development, in your browser, navigate to:

```sh
http://localhost:8000
```

## Deployment

View the latest deploy on Render at: https://idea-tracker-179p.onrender.com. Sign up for a new account or use credentials below.

**username**: test

**password**: password
