import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('ChannelsController', () => {
  let controller: ChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [{ provide: ChannelsService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChannelsController>(ChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
