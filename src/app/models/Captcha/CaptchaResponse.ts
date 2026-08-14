export interface CaptchaResponse {
  isSuccess: boolean;
  message?: string;
  data?: {
    captchaId: string;
    image: string;
    expiresInSeconds: number;
  };
}
