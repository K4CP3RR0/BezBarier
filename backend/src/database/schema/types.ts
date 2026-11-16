import { customType } from 'drizzle-orm/pg-core';

/** PostGIS GEOGRAPHY(POINT,4326) — DBML `point` */
export const geographyPoint = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'geography(Point,4326)';
  },
});
