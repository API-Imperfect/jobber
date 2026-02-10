import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { compare } from 'bcryptjs';
import { LoginInput } from './dto/login.input';
import { TokenPayload } from './token-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);

    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS')),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const accessToken = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires,
      sameSite: 'lax',
    });

    return user;
  }

  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
