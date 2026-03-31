import type { Resolver } from 'react-hook-form'
import type { ZodTypeAny } from 'zod'

export function zodResolver<T extends ZodTypeAny>(schema: T): Resolver {
  return async (values) => {
    const result = await schema.safeParseAsync(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    const errors = result.error.issues.reduce<Record<string, { type: string; message: string }>>(
      (acc, issue) => {
        const path = issue.path.join('.')
        if (path && !acc[path]) {
          acc[path] = {
            type: issue.code,
            message: issue.message,
          }
        }
        return acc
      },
      {},
    )

    return {
      values: {},
      errors,
    }
  }
}
