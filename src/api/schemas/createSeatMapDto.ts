/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * Vedge API
 * 암표 방지 티켓 예매 서비스 Vedge API 문서
 * OpenAPI spec version: 1.0
 */
import type { CreateSectionDto } from './createSectionDto';

export interface CreateSeatMapDto {
  /** 좌석 배치도 이름 */
  name: string;
  /** 구역 목록 */
  sections: CreateSectionDto[];
}