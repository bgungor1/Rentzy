import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID('4', { message: 'Geçerli bir araç varyant IDsi giriniz.' })
  @IsNotEmpty({ message: 'Araç varyantı seçilmelidir.' })
  variantId: string;

  @IsDateString({}, { message: 'Geçerli bir başlangıç tarihi giriniz.' })
  @IsNotEmpty({ message: 'Başlangıç tarihi boş bırakılamaz.' })
  startDate: string;

  @IsDateString({}, { message: 'Geçerli bir bitiş tarihi giriniz.' })
  @IsNotEmpty({ message: 'Bitiş tarihi boş bırakılamaz.' })
  endDate: string;
}
