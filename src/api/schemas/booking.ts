import { z } from 'zod';

export const bookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  additionalneeds: z.string().optional(),
});

export type Booking = z.infer<typeof bookingSchema>;

export type BookingInput = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
};

export type BookingPatch = Partial<
  Pick<BookingInput, 'firstname' | 'lastname' | 'totalprice' | 'depositpaid' | 'additionalneeds'>
>;

export const createdBookingSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: bookingSchema,
});

export type CreatedBooking = z.infer<typeof createdBookingSchema>;

export const authSuccessSchema = z.object({
  token: z.string().min(1),
});

export const authFailureSchema = z.object({
  reason: z.string().min(1),
});

export const bookingIdListSchema = z
  .array(
    z.object({
      bookingid: z.number().int().positive(),
    }),
  )
  .min(1);
