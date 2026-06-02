import { BookingModule } from './booking/booking.module';
import { BookingItemsModule } from './booking-items/booking-items.module';
import { BookingChargesModule } from './booking-charges/booking-charges.module';
import { LrModule } from './lr/lr.module';
import { EwaybillModule } from './ewaybill/ewaybill.module';
import { PrnModule } from './prn/prn.module';
import { PrnLrsModule } from './prn-lrs/prn-lrs.module';
import { ManifestModule } from './manifest/manifest.module';
import { ManifestLrsModule } from './manifest-lrs/manifest-lrs.module';
import { TripModule } from './trip/trip.module';
import { TripLrsModule } from './trip-lrs/trip-lrs.module';
import { DrsModule } from './drs/drs.module';
import { DrsLrsModule } from './drs-lrs/drs-lrs.module';
import { PodModule } from './pod/pod.module';
import { DriverTasksModule } from './driver-tasks/driver-tasks.module';
import { LrStateLogModule } from './lr-state-log/lr-state-log.module';
import { PrnBookingsModule } from './prn-bookings/prn-bookings.module';
import { RouteMasterModule } from './route-master/route-master.module';
import { RouteStopsModule } from './route-stops/route-stops.module';
import { TripExpensesModule } from './trip-expenses/trip-expenses.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BookingModule,
    BookingItemsModule,
    BookingChargesModule,
    LrModule,
    EwaybillModule,
    PrnModule,
    PrnLrsModule,
    ManifestModule,
    ManifestLrsModule,
    TripModule,
    TripLrsModule,
    DrsModule,
    DrsLrsModule,
    PodModule,
    DriverTasksModule,
    LrStateLogModule,
    PrnBookingsModule,
    RouteMasterModule,
    RouteStopsModule,
    TripExpensesModule
  ],
})
export class OperationsModule {}
