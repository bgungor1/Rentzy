import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async register(registerDto: RegisterDto) {
        const { email, password, fullName } = registerDto;

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Bu email adresi zaten sistemde kayıtlı.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await this.usersService.create({
            email,
            fullName,
            password: hashedPassword,
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return userWithoutPassword;
    }
}