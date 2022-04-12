import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './users/users.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: MemberController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [AppService],
    }).compile();

    appController = app.get<MemberController>(MemberController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
