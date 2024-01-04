import { Test, TestingModule } from '@nestjs/testing';
import { ItemsOrderController } from '../items-order.controller';

describe('ItemsOrderController', () => {
  let controller: ItemsOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsOrderController],
    }).compile();

    controller = module.get<ItemsOrderController>(ItemsOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
