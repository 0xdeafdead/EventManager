import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JWTGuard } from '../../guards/JWTGuard.guard';
import { of } from 'rxjs';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  const userServiceMock = {
    getUserByEmail: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user', () => {
      const user = { id: '1', email: 'jL6lH@example.com' };
      service.getUserByEmail = jest.fn().mockReturnValueOnce(of(user));
      resolver.getUser({ sub: 'jL6lH@example.com' }).subscribe({
        next: (result) => {
          expect(result).toEqual(user);
        },
      });
    });
  });
});
