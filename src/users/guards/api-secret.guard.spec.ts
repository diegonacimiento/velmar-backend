import { ApiSecretGuard } from './api-secret.guard';

describe('ApiSecretGuard', () => {
  it('should be defined', () => {
    expect(new ApiSecretGuard()).toBeDefined();
  });
});
