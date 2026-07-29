import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [PrismaModule, CarsModule, UsersModule, AuthModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
