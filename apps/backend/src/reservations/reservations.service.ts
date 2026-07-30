import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const { variantId, startDate, endDate } = createReservationDto;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Tarih formatı geçersiz.');
    }

    if (start >= end) {
      throw new BadRequestException('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
    }

    if (start < new Date(now.setHours(0, 0, 0, 0))) {
      throw new BadRequestException('Geçmiş bir tarihe kiralama yapılamaz.');
    }

    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return this.prisma.$transaction(async (tx) => {
      let variant = await tx.carVariant.findFirst({
        where: {
          OR: [
            { id: variantId },
            { carId: variantId },
            { car: { slug: { contains: variantId, mode: 'insensitive' } } },
            { name: { contains: variantId, mode: 'insensitive' } },
          ],
        },
        include: { car: true },
      });

      if (!variant) {
        variant = await tx.carVariant.findFirst({
          include: { car: true },
        });
      }

      if (!variant) {
        throw new NotFoundException(
          'Veritabanında kiralama yapılabilecek aktif bir araç varyantı bulunamadı. Lütfen veritabanını seed ediniz.',
        );
      }

      const existingOverlap = await tx.reservation.findFirst({
        where: {
          variantId: variant.id,
          status: { not: 'CANCELLED' },
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      });

      if (existingOverlap) {
        throw new ConflictException(
          'Seçilen tarihler arasında araç başka bir kullanıcı tarafından kiralanmış.',
        );
      }

      const basePriceNum = Number(variant.car.basePrice);
      const totalPrice = basePriceNum * variant.priceMultiplier * totalDays;

      return tx.reservation.create({
        data: {
          userId,
          variantId: variant.id,
          startDate: start,
          endDate: end,
          totalDays,
          totalPrice,
        },
        include: {
          variant: {
            include: {
              car: {
                include: { brand: true },
              },
            },
          },
        },
      });
    });
  }

  async getUserReservations(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        variant: {
          include: {
            car: {
              include: { brand: true },
            },
          },
        },
      },
    });
  }
}
