export class AppError extends Error {
  public data?: Record<string, unknown>
  constructor(
    public code: string,
    public statusCode: number,
    dataOrMessage?: string | Record<string, unknown>
  ) {
    const message = typeof dataOrMessage === 'string' ? dataOrMessage : code
    super(message)
    this.name = 'AppError'
    if (dataOrMessage && typeof dataOrMessage === 'object') {
      this.data = dataOrMessage
    }
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
