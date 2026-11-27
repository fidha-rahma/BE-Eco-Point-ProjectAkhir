import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private users: Repository<User>,
        private jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.users.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email sudah terdaftar');

        const password = await bcrypt.hash(dto.password, 10);
        const user = this.users.create({
            name: dto.name,
            email: dto.email,
            password,
            role: UserRole.MEMBER,
            totalPoints: 0,
        });
        const saved = await this.users.save(user);
        return { id: saved.id, name: saved.name, email: saved.email, role: saved.role };
    }

    async login(dto: LoginDto) {
        const user = await this.users.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: dto.email })
            .getOne();

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Email atau password salah');
        }

        const accessToken = await this.jwt.signAsync({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    }
}