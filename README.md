# LinkShortenerGraphQL

LinkShortenerGraphQL is a simple URL shortener service that uses GraphQL and NestJS to provide a fast and scalable API for shortening and managing URLs. The project is based on the popular nestjs/graphql package and leverages the power of GraphQL to provide a flexible and efficient API for creating, reading, updating, and deleting shortened URLs.
![tests](https://github.com/BaseMax/LinkShortenerGraphQL/assets/51885828/2e63e815-e7f3-4181-814a-81b3e606ecea)
![apollo-sandbox](https://github.com/BaseMax/LinkShortenerGraphQL/assets/51885828/8dc783a3-df47-47d2-9937-27f1af943e5a)



## Features

- Shorten URLs using a custom short link or a randomly generated one
- Retrieve a shortened URL's full link by providing its ID
- Update a shortened URL's properties, such as its short link or expiration date
- Delete a shortened URL by providing its ID
- Secure API using JWT authentication

## GraphQL API documentation

| Query                                                      | Description                                          |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `getShortUrlById(id: ID!)`                                 | Get a shortened URL by its ID                        |
| `getShortUrlByShortLink(shortLink: ID!)`                    | Get a shortened URL by its short link                |
| `user`                                                     | Get the authenticated user's information             |
| `createShortUrl(input: CreateShortUrlInput!)`              | Create a new shortened URL                           |
| `updateShortUrl(input: UpdateShortUrlInput!)`              | Update an existing shortened URL                     |
| `deleteShortUrl(id: ID!)`                                  | Delete a shortened URL by its ID                      |
| `register(input: RegisterUserInput!)`                      | Register a new user                                  |
| `login(input: LoginUserInput!)`                            | Authenticate a user and generate a JWT token         |

| Mutation                                                   | Description                                          |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| `createShortUrl(input: CreateShortUrlInput!)`              | Create a new shortened URL                           |
| `updateShortUrl(input: UpdateShortUrlInput!)`              | Update an existing shortened URL                     |
| `deleteShortUrl(id: ID!)`                                  | Delete a shortened URL by its ID                      |
| `register(input: RegisterUserInput!)`                      | Register a new user                                  |
| `login(input: LoginUserInput!)`                            | Authenticate a user and generate a JWT token         |

Here are some examples of queries and mutations in GraphQL syntax for the LinkShortenerGraphQL API:


#### Getting started
clone the repository:
```bash
git clone https://github.com/BaseMax/LinkShortenerGraphQL
```

To start the development environment, run the following command:
```bash 
docker-compose -f docker-compose.dev.yml up

```


To run the e2e tests use :
```bash 
docker-compose -f docker-compose.test.yml up
```

## Usage

1. Get user information:

```gql
query {
  user {
    id
    firstName
    lastName
    email
  }
}
```

2. Get a short URL by ID:

```gql
query {
  getShortUrlById(id: "123") {
    id
    fullLink
    shortLink
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    updatedAt
  }
}
````

3. Create a new short URL:

```gql
mutation {
  createShortUrl(input: {
    fullLink: "https://www.example.com/long/link/to/page"
  }) {
    id
    fullLink
    shortLink
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    updatedAt
  }
}
```



4. Update an existing short URL:

```gql
mutation {
  updateShortUrl(input: {
    id: "123"
    fullLink: "https://www.example.com/new/long/link/to/page"
  }) {
    id
    fullLink
    shortLink
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    updatedAt
  }
}
```

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

## License

This project is licensed under the GPL-3.0 license. See the LICENSE file for more details.
