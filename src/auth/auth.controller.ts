import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Usuário já cadastrado' })

  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    description: 'Credenciais de login',
    schema: {
      example: {
        username: 'admin',
        password: '123456',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso e token JWT retornado' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.username, dto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.authService.login(user);
  }
}
