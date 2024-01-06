import { ValidateCredentialsGuard } from '../validate-credentials.guard';

describe('ValidateCredentialsGuard', () => {
  it('should be defined', () => {
    expect(new ValidateCredentialsGuard()).toBeDefined();
  });
});
