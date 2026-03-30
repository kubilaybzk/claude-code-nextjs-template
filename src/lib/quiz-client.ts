/**
 * Quiz API Client — Quiz servisi için özelleştirilmiş HTTP client.
 *
 * - Base URL: NEXT_PUBLIC_QUIZ_API_URL env değişkeninden alınır
 * - Auth: Cookie'deki `auth_token` okunup Authorization header olarak gönderilir
 * - Array params desteği: `difficulty=1.1&difficulty=2.1` formatında
 */

const QUIZ_BASE_URL = process.env.NEXT_PUBLIC_QUIZ_API_URL ?? 'https://quiz.priviahub.test';

interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: Record<string, unknown>
}

class QuizApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = 'QuizApiError'
  }
}

/**
 * URL oluşturur ve query parametrelerini ekler
 *
 * Array parametreler tekrarlı key formatında eklenir:
 * `{ difficulty: [1.1, 2.1] }` → `?difficulty=1.1&difficulty=2.1`
 *
 * @param endpoint - API endpoint yolu
 * @param params - Query parametreleri
 * @returns Tam URL string
 *
 * @example
 * buildQuizUrl('/quiz', { page: 1, difficulty: [1.1, 2.1] })
 * // → "https://quiz.priviahub.test/quiz?page=1&difficulty=1.1&difficulty=2.1"
 */
function buildQuizUrl(endpoint: string, params?: RequestConfig['params']): string {
  const url = new URL(`${QUIZ_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, String(item)))
      } else {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Cookie'den auth token'ı okur
 *
 * @returns Token string veya null
 */
function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Quiz API'ye HTTP isteği gönderen merkezi fonksiyon
 *
 * İşlem adımları:
 * 1. Cookie'den auth token okunur ve Authorization header'a eklenir
 * 2. Query parametreleri (array dahil) URL'e eklenir
 * 3. Body varsa JSON.stringify ile serialize edilir
 * 4. Başarısız response'larda hata body'si parse edilip QuizApiError fırlatılır
 * 5. Boş response'larda undefined, dolu response'larda parse edilmiş JSON döner
 *
 * @template T - Beklenen response tipi
 * @param endpoint - API endpoint yolu (örn: '/question', '/quiz/123')
 * @param config - İstek ayarları (body, params, headers vb.)
 * @returns Parse edilmiş API response
 * @throws {QuizApiError} HTTP hata durumlarında (status, error message ve response body ile)
 *
 * @example
 * // GET isteği
 * const data = await request<QuestionList>('/question', { params: { page: 1 } })
 *
 * @example
 * // POST isteği
 * const result = await request<{ id: string }>('/question', {
 *   method: 'POST',
 *   body: { title: 'Yeni soru', difficulty: 2.1 },
 * })
 */
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { body, params, headers: customHeaders, ...restConfig } = config
  const token = getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...customHeaders,
  }

  const response = await fetch(buildQuizUrl(endpoint, params), {
    ...restConfig,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new QuizApiError(
      errorData?.error ?? `HTTP Error: ${response.status}`,
      response.status,
      errorData,
    )
  }

  const text = await response.text()
  if (!text) return undefined as T

  return JSON.parse(text)
}

/**
 * Quiz API client — HTTP metotlarını kısa yoldan çağırmak için facade
 *
 * Her metot dahili `request` fonksiyonunu ilgili HTTP method ile çağırır.
 * Auth token ve query param yönetimi otomatik olarak yapılır.
 *
 * @example
 * // Liste çek
 * const list = await quizClient.get<QuestionList>('/question', { params: { page: 1 } })
 *
 * @example
 * // Yeni kayıt oluştur
 * const { id } = await quizClient.post<{ id: string }>('/question', formData)
 *
 * @example
 * // Kayıt sil
 * await quizClient.delete('/question/abc-123')
 */
export const quizClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PATCH', body }),

  delete: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE', body }),
}

export { QuizApiError }
