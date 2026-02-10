import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './models/user.model';
import { Prisma } from '@prisma-clients/jobber-auth';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10),
      },
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async getUser(args: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prismaService.user.findUniqueOrThrow({
      where: args,
    });
  }
}
