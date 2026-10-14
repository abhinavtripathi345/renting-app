import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProvidersModule } from './providers/providers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ConditionReportsModule } from './condition-reports/condition-reports.module';
import { AgreementsModule } from './agreements/agreements.module';
import { ReviewsModule } from './reviews/reviews.module';
import { DisputesModule } from './disputes/disputes.module';
import { LocationsModule } from './locations/locations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProvidersModule,
    VehiclesModule,
    BookingsModule,
    PaymentsModule,
    ConditionReportsModule,
    AgreementsModule,
    ReviewsModule,
    DisputesModule,
    LocationsModule,
    NotificationsModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
