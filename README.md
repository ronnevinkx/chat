# Chat

React app with Apollo Server backend.

## Client Technologies

-   React
-   Apollo Client
-   React Bootstrap

## Backend Technologies

-   Node.js
-   Apollo Server
-   GraphQL
-   Sequelize
-   Sequelize CLI
-   MySQL
-   JSON Web Token
-   Bcrypt

## Scripts

| Description                  | Command          | Value                                                |
| ---------------------------- | ---------------- | ---------------------------------------------------- |
| Start server                 | `npm run start`  | `node server.js`                                     |
| Start server with Nodemon    | `npm run server` | `nodemon server.js`                                  |
| Start client                 | `npm run client` | `npm start --prefix client`                          |
| Start both client and server | `npm run dev`    | `concurrently \"npm run server\" \"npm run client\"` |

## API Routes

| Description           | Route                              |
| --------------------- | ---------------------------------- |
| Get all questions     | `GET /api/questions/`              |
| Get specific question | `GET /api/questions/:id/`          |
| Create a new question | `POST /api/questions/add/`         |
| Delete a question     | `DELETE /api/questions/delete/:id` |

## Notes

-   Based on [this](https://www.youtube.com/playlist?list=PLMhAeHCz8S3_VYiYxpcXtMz96vePOuOX3) Classed tutorial.

-   VSCode extension for GraphQL syntax highlighting: `GraphQL for VSCode`

## Sequelize

-   `sequelize --help` to list all sequelize CLI commands (run in dir where sequelize is locally installed)
-   `sequelize init`

### Setting up a migration and migrate

-   `sequelize model:generate --name Message --attributes content:string,uuid:uuid,from:string,to:string`
-   `sequelize db:migrate`

## Queries

```
mutation register {
  register(username:"Username", email:"name@email.com", password:"1234", confirmPassword:"1234") {
    username
    email
  }
}

query login {
  login(username:"Username",password:"1234") {
    username
    email
	token
  }
}

query getUsers {
  getUsers {
    username
    email
  }
}
```

For `getUsers`:

```
{
	"Authorization":"Bearer (token here)"
}
```
