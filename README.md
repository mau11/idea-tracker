# Idea Tracker

> Log in to create lists of ideas and track their status.

## Table of Contents

1. [Tech Stack](#tech-stack)
1. [Requirements](#requirements)
1. [Development](#development)
   1. [Installing Dependencies](#installing-dependencies)
   1. [Running the Server](#running-the-server)

## Tech Stack

- **JavaScript**
- **EJS**
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**

## Requirements

- Node v24.2.0
- pnpm v10.6.2

## Development

#### Setting up Database

Setup up a [MongoDB Atlas account](https://www.mongodb.com/). Create a new database called `idea_tracker` with the collections: `users`, `ideas`, and `lists`.

#### Environment Variables

Copy environment variables from example and save to .env

```sh
$ cp .env.example .env
```

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
