/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * Vedge API
 * 암표 방지 티켓 예매 서비스 Vedge API 문서
 * OpenAPI spec version: 1.0
 */
import {
  HttpResponse,
  delay,
  http
} from 'msw'


export const getUsersControllerGetMeMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.get('*/users/me', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}

export const getUsersControllerUpdateMeMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.put>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.put('*/users/me', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}
export const getUsersMock = () => [
  getUsersControllerGetMeMockHandler(),
  getUsersControllerUpdateMeMockHandler()
]