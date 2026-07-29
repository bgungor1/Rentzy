import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @CurrentUser('sub') userId: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationsService.create(userId, createReservationDto);
  }

  @Get()
  async getUserReservations(@CurrentUser('sub') userId: string) {
    return this.reservationsService.getUserReservations(userId);
  }
}
