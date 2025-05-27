import { toast } from "@/components/ui/use-toast"

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    // Handle different types of errors
    if (error?.data?.message) {
      return {
        message: error.data.message,
        status: error.status,
        code: error.data.code,
        details: error.data.details,
      }
    }

    if (error?.message) {
      return {
        message: error.message,
        status: error.status,
      }
    }

    // Network errors
    if (error?.name === "NetworkError" || error?.code === "NETWORK_ERROR") {
      return {
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
      }
    }

    // Timeout errors
    if (error?.name === "TimeoutError" || error?.code === "TIMEOUT") {
      return {
        message: "Request timed out. Please try again.",
        code: "TIMEOUT",
      }
    }

    // Default error
    return {
      message: "An unexpected error occurred. Please try again.",
      code: "UNKNOWN_ERROR",
    }
  }

  static showToast(error: any, customMessage?: string) {
    const apiError = this.handle(error)

    toast({
      title: "Error",
      description: customMessage || apiError.message,
      variant: "destructive",
    })
  }

  static getErrorMessage(error: any): string {
    return this.handle(error).message
  }

  static isNetworkError(error: any): boolean {
    const apiError = this.handle(error)
    return apiError.code === "NETWORK_ERROR"
  }

  static isAuthError(error: any): boolean {
    const apiError = this.handle(error)
    return apiError.status === 401 || apiError.status === 403
  }
}

// Hook for handling API errors
export function useApiErrorHandler() {
  const handleError = (error: any, customMessage?: string) => {
    ApiErrorHandler.showToast(error, customMessage)
  }

  const getErrorMessage = (error: any): string => {
    return ApiErrorHandler.getErrorMessage(error)
  }

  return {
    handleError,
    getErrorMessage,
    isNetworkError: ApiErrorHandler.isNetworkError,
    isAuthError: ApiErrorHandler.isAuthError,
  }
}
