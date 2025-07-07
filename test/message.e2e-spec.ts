import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MessageController (e2e)', () => {
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

  describe('POST /messages', () => {
  
      it('It should show the created message', () => {
        return request(app.getHttpServer())
          .post('/api/messages')
          .send({
            userId: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f',
            content: 'Hi there, this is a test message',
          })
          .expect(200); 
      });
      
      it('It should show that the input data is invalid', () => {
        return request(app.getHttpServer())
          .post('/api/messages')
          .send({
            userId: 122254,
            content: 'Hi there, this is a test message',
          })
          .expect(401);
      });
  
      it('It should show that the input data is invalid', () => {
        return request(app.getHttpServer())
          .post('/api/messages')
          .send({
            userId: '45440fe0-bf9e-49c1-93a4-ce8ac5ac720f'
          })
          .expect(401);
      });
  
      it('It should show that the input data is invalid', () => {
        return request(app.getHttpServer())
          .post('/api/messages')
          .send({
            content: 'Hi there, this is a test message',
          })
          .expect(401);
      });
  
    });
  
    describe('DELETE /messages/:id ', () => {
      it(`should deny access to user doesn't exist in the database`, () => {
        return request(app.getHttpServer())
          .delete('/api/messages/85d99f95-d085-428e-a422-200172d23898')
          .expect(401);
      });
  
      it('It should show the message deletion correctly', () => {
        return request(app.getHttpServer())
          .delete('/api/messages/45440fe0-bf9e-49c1-93a4-ce8ac5ac720f')
          .expect(200); 
      });
    });
});
