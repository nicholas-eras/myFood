import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<GetUserDto> {
    const userExists: User|null = await this.userRepository.findByEmail(dto.email);

    if (userExists) {
      throw new BadRequestException('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const createdUser: UserEntity = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    return {
      id: createdUser.id!,
      email: createdUser.email,
    };
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
