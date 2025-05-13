import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    // Adicione outros campos obrigatórios se necessário
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockImplementation((user) => 
              Promise.resolve({ id: 1, ...user })
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token when credentials are valid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password'
      };
      
      const result = await controller.login(loginDto);
      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
      
      const loginDto: LoginDto = {
        username: 'invalid',
        password: 'wrong'
      };
      
      await expect(controller.login(loginDto)).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'newpassword'
      };

      jest.spyOn(authService, 'register').mockResolvedValue({
        message: 'User registered successfully'
      });

      const result = await controller.register(registerDto);
      expect(result).toEqual({ 
        message: 'User registered successfully' 
      });
    });

    it('should throw BadRequestException when username already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'existinguser',
        password: 'password'
      };

      jest.spyOn(authService, 'register').mockRejectedValue(
        new BadRequestException('Username already exists')
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});