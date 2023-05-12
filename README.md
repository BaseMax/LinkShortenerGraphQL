# LinkShortenerGraphQL

LinkShortenerGraphQL is a simple URL shortener service that uses GraphQL and NestJS to provide a fast and scalable API for shortening and managing URLs. The project is based on the popular nestjs/graphql package and leverages the power of GraphQL to provide a flexible and efficient API for creating, reading, updating, and deleting shortened URLs.

## Features

- Shorten URLs using a custom short link or a randomly generated one
- Retrieve a shortened URL's full link by providing its ID
- Update a shortened URL's properties, such as its short link or expiration date
- Delete a shortened URL by providing its ID
- Secure API using JWT authentication

## Installation

To install and run the project, follow these steps:

- Clone the repository to your local machine:

```bash
git clone https://github.com/basemax/LinkShortenerGraphQL
```

Install the project dependencies:

```bash
cd link-shortener-graphql
npm install
```

Set up the environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with your environment-specific values.

Start the development server:

```bash
npm run start:dev
```

The GraphQL API should now be available at http://localhost:3000/graphql.

## Usage

To use the API, you can use any GraphQL client, such as Altair GraphQL Client. Here are some example queries and mutations that you can use:

Create a shortened URL:

```graphql
mutation {
  createShortUrl(fullLink: "https://www.google.com", shortLink: "google") {
    id
    fullLink
    shortLink
  }
}
```
Get a shortened URL by ID

```graphql
query {
  getShortUrlById(id: "1") {
    id
    fullLink
    shortLink
  }
}
```

Update a shortened URL

```graphql
mutation {
  updateShortUrl(id: "1", shortLink: "newlink") {
    id
    fullLink
    shortLink
  }
}
```

Delete a shortened URL

```graphql
mutation {
  deleteShortUrl(id: "1")
}
```

For a complete list of available queries and mutations, see the GraphQL schema file in the src directory.

## Contributing

Contributions to the project are welcome! To contribute, follow these steps:

## Routes

Sure, here's an example list of routes needed for a LinkShortenerGraphQL project with authentication and registration:

- POST /auth/register
- POST /auth/login
- GET /auth/user
- POST /shorturls/create
- GET /shorturls/:id
- PUT /shorturls/:id
- DELETE /shorturls/:id

Here's a brief description of each route:

- /auth/register - create a new user account
- /auth/login - authenticate a user and retrieve a JWT token
- /auth/user - retrieve information about the currently authenticated user
- /shorturls/create - create a new shortened URL
- /shorturls/:id - retrieve information about a shortened URL by its ID
- /shorturls/:id - update the properties of a shortened URL by its ID
- /shorturls/:id - delete a shortened URL by its ID

In this example, authentication is handled using JWT tokens, which are obtained by logging in with valid credentials. Once a user is authenticated, they can create, view, update, and delete their own shortened URLs. All requests to protected routes require a valid JWT token in the Authorization header.

## License

This project is licensed under the GPL-3.0 license. See the LICENSE file for more details.
