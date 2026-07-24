import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface GetCarsQueryDto {
  brand?: string;
  search?: string;
}

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tüm araçları getirir (Marka slug'ına göre filtreleme ve isim/açıklamada arama destekli)
   */
  async findAll(query?: GetCarsQueryDto) {
    const { brand, search } = query || {};

    return this.prisma.car.findMany({
      where: {
        ...(brand && {
          brand: {
            slug: { equals: brand, mode: 'insensitive' },
          },
        }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        variants: {
          orderBy: {
            priceMultiplier: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Hem UUID (ID) hem de SEO-dostu Slug (örn: 'm4-g82-adro') ile araç arar
   */
  async findOne(idOrSlug: string) {
    const car = await this.prisma.car.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        brand: true,
        variants: {
          orderBy: {
            priceMultiplier: 'asc',
          },
        },
      },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID or Slug '${idOrSlug}' not found`);
    }

    return car;
  }
}