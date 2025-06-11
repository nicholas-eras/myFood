import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: userEntity.email,
        password: userEntity.password,
      },
    });

    return {
      id: prismaUser.id,
      email: prismaUser.email,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt,
    };
  }
}
