import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Global validation pipe - same as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // API prefix - needs to match main.ts setting
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/:id/messages', () => {
    // This test may fail without a database connection
    // It's skipped for now as it needs actual database with users
    it.skip('should get all messages for a specific user', () => {
      return request(app.getHttpServer())
        .get('/api/users/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f/messages')
        .expect(200)
        .expect((res: { body: unknown[] }) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });


    it(`should deny access to user doesn't exist in the database`, () => {
      return request(app.getHttpServer())
        .get('/api/users/85d99f95-d085-428e-a422-200172d23898/messages')
        .expect(404); // Unauthorized since the user doesn't exist in the database
    });

  });

  describe('GET /users/:id', () => {
    
    it('should get specific user', () => {
      return request(app.getHttpServer())
        .get('/api/users/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f')
        .expect(200)
    });

    it(`should deny access to user doesn't exist in the database`, () => {
      return request(app.getHttpServer())
        .get('/api/users/85d99f95-d085-428e-a422-200172d23898')
        .expect(404); // Unauthorized since the user doesn't exist in the database
    });
  });

  describe('PUT /users/:id', () => {
    it('It should show the user that was updated', () => {
      return request(app.getHttpServer())
        .put('/api/users/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f')
        .send({
          name: 'test_user',
          email: 'updated@example.com',
        })
        .expect(200);
    });

    it('should show that the input data is invalid', () => {
      return request(app.getHttpServer())
        .put('/api/users/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f')
        .send({
          name: 'test',
          email: 'not-an-email',
        })
        .expect(401);
    });
    
    it(`should deny access to user doesn't exist in the database`, () => {
      return request(app.getHttpServer())
        .put('/api/users/85d99f95-d085-428e-a422-200172d23898')
        .send({
          name: 'test',
          email: 'updated@example.com',
        })
        .expect(404);
    });
  });

  describe('POST /users', () => {

    it('Should show the created user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'test_user',
          email: 'test@gmail.com',
        })
        .expect(200); 
    });
    
    it('Should show that the input data is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'test_user',
          email: 'not-an-email',
        })
        .expect(401);
    });

    it('Should show that the input data is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          name: 'test_user',
        })
        .expect(401);
    });

    it('Should show that the input data is invalid', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          email: 'test@gmail.com',
        })
        .expect(401);
    });

  });

  describe('DELETE /users/:id ', () => {
    it(`should deny access to user doesn't exist in the database`, () => {
      return request(app.getHttpServer())
        .delete('/api/users/85d99f95-d085-428e-a422-200172d23898')
        .expect(401);
    });

    it('should require authorization for deletion', () => {
      return request(app.getHttpServer())
        .delete('/api/users/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f')
        .expect(200); 
    });
  });

});
