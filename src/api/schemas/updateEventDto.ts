/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * Vedge API
 * 암표 방지 티켓 예매 서비스 Vedge API 문서
 * OpenAPI spec version: 1.0
 */
import type { CreateEventAdditionalInfoDto } from './createEventAdditionalInfoDto';
import type { UpdateEventDtoCategory } from './updateEventDtoCategory';
import type { CreateEventScheduleDto } from './createEventScheduleDto';
import type { CreateSeatMapDto } from './createSeatMapDto';

export interface UpdateEventDto {
  additionalInfo?: CreateEventAdditionalInfoDto[];
  address?: string;
  amount?: number;
  category?: UpdateEventDtoCategory;
  duration?: number;
  endAvailable?: string;
  posterImage?: string;
  schedule?: CreateEventScheduleDto[];
  seatMap?: CreateSeatMapDto;
  startAvailable?: string;
  ticketImage?: string;
  title?: string;
  viewingAge?: number;
}