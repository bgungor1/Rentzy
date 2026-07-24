import { Controller, Get, Param, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll(
    @Query('brand') brand?: string,
    @Query('search') search?: string,
  ) {
    return this.carsService.findAll({ brand, search });
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.carsService.findOne(idOrSlug);
  }
}