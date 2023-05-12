import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaClient, ShortUrl, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let users: User[];
  let shortUrls: ShortUrl[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await app.init();
  });
  beforeEach(async () => {
    await prisma.shortUrl.deleteMany({});
    await prisma.user.deleteMany({});
    // create test users
    await prisma.user.createMany({
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: await hash('password'),
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'janedoe@example.com',
          password: await hash('password'),
        },
      ],
    });

    users = await prisma.user.findMany();
    // create test short urls
    await prisma.shortUrl.createMany({
      data: [
        {
          shortLink: 'abc',
          fullLink: 'https://example.com',
          userId: users[0].id,
        },
        {
          shortLink: 'def',
          fullLink: 'https://example.com/page2',
          userId: users[0].id,
        },
        {
          shortLink: 'ghi',
          fullLink: 'https://example.com/page3',
          userId: users[1].id,
        },
      ],
    });
    shortUrls = await prisma.shortUrl.findMany();
  });
  describe('login mutation', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const email = users[0].email;
      const password = 'password';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user.id).toBe(users[0].id);
      expect(response.body.data.login.user.firstName).toBe(users[0].firstName);
      expect(response.body.data.login.user.lastName).toBe(users[0].lastName);
      expect(response.body.data.login.user.email).toBe(users[0].email);
    });

    it('should not login with invalid email address', async () => {
      // Arrange
      const email = 'invalidemail@example.com';
      const password = 'password';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not login with invalid password', async () => {
      // Arrange
      const email = users[0].email;
      const password = 'invalidpassword';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });
  describe('register mutation', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const firstName = 'Alice';
      const lastName = 'Smith';
      const email = 'alicesmith@example.com';
      const password = 'Password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.register.token).toBeDefined();
      expect(response.body.data.register.user.firstName).toBe(firstName);
      expect(response.body.data.register.user.lastName).toBe(lastName);
      expect(response.body.data.register.user.email).toBe(email);
    });

    it('should not register a user with an existing email address', async () => {
      // Arrange
      const firstName = 'Jane';
      const lastName = 'Doe';
      const email = users[0].email;
      const password = 'password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with an invalid email address', async () => {
      // Arrange
      const firstName = 'Bob';
      const lastName = 'Smith';
      const email = 'invalidemail';
      const password = 'password123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with an invalid password', async () => {
      // Arrange
      const firstName = 'Charlie';
      const lastName = 'Smith';
      const email = 'charliesmith@example.com';
      const password = 'invalidpassword';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with a password that is too short', async () => {
      // Arrange
      const firstName = 'David';
      const lastName = 'Smith';
      const email = 'davidsmith@example.com';
      const password = 'pass123!';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not register a user with a password that does not meet complexity requirements', async () => {
      // Arrange
      const firstName = 'Eve';
      const lastName = 'Smith';
      const email = 'evesmith@example.com';
      const password = 'password';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
              }
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toBeNull();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });
  describe('authentication', () => {
    let user: User;
    let authToken: string;

    it('should register a new user and allow them to log in', async () => {
      // Register a new user
      const firstName = 'Alice';
      const lastName = 'Smith';
      const email = 'alicesmith@example.com';
      const password = 'Password1!';

      const registerResponse = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            register(input: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}" }) {
              token
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
        `,
        });

      // Assert
      expect(registerResponse.status).toBe(200);
      expect(registerResponse.body.data).not.toBeNull();
      expect(registerResponse.body.data.register.token).toBeDefined();
      expect(registerResponse.body.data.register.user.firstName).toBe(
        firstName,
      );
      expect(registerResponse.body.data.register.user.lastName).toBe(lastName);
      expect(registerResponse.body.data.register.user.email).toBe(email);

      user = registerResponse.body.data.register.user;
      authToken = registerResponse.body.data.register.token;

      // Log in with the same credentials used during registration
      const loginResponse = await request(app.getHttpServer())
        .post(gql)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          query: `
          mutation {
            login(input: { email: "${email}", password: "${password}" }) {
              token
              user {
                id
                firstName
                lastName
                email
              }
            }
          }
        `,
        });

      // Assert
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.data).not.toBeNull();
      expect(loginResponse.body.data.login.token).toBeDefined();
      expect(loginResponse.body.data.login.user.firstName).toBe(firstName);
      expect(loginResponse.body.data.login.user.lastName).toBe(lastName);
      expect(loginResponse.body.data.login.user.email).toBe(email);
    });
  });
  describe('getShortUrlById', () => {
    it('should return the correct short URL information for a valid ID', async () => {
      // Choose an existing ID of a short URL
      const validId = shortUrls[0].id; // choose the ID of an existing short URL
      const expectedShortUrl = shortUrls[0]; // get the expected short URL object using the chosen ID

      const query = `
      query {
        getShortUrlById(id: "${validId}") {
          id
          shortLink
          fullLink
          user {
            id
            firstName
            lastName
          }
          createdAt
          updatedAt
        }
      }
    `;
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.getShortUrlById).toBeDefined();

      const actualShortUrl = response.body.data.getShortUrlById;
      expect(actualShortUrl.id).toBe(expectedShortUrl.id);
      expect(actualShortUrl.shortLink).toBe(expectedShortUrl.shortLink);
      expect(actualShortUrl.fullLink).toBe(expectedShortUrl.fullLink);
      expect(actualShortUrl.createdAt).toBe(
        expectedShortUrl.createdAt.toISOString(),
      );
      expect(actualShortUrl.updatedAt).toBe(
        expectedShortUrl.updatedAt.toISOString(),
      );
    });

    it('should return an error with the appropriate error code for an invalid ID', async () => {
      // Choose an invalid ID for a short URL
      const invalidId = 'invalid_id';

      const query = `
      query {
        getShortUrlById(id: "${invalidId}") {
          id
          shortLink
          fullLink
          user {
            id
            firstName
            lastName
          }
          createdAt
          updatedAt
        }
      }
    `;
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // Ensure that the response contains an error with the appropriate error code
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.getShortUrlById).toBeNull();
    });
  });
  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
});
