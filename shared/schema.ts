import { z } from "zod";

export const currencySchema = z.enum(["ETH", "USDC"]);
export type Currency = z.infer<typeof currencySchema>;

export const tipRequestSchema = z.object({
  targetAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
  currency: currencySchema,
  senderFid: z.number().optional(),
  senderUsername: z.string().optional(),
});

export type TipRequest = z.infer<typeof tipRequestSchema>;

export const tipResponseSchema = z.object({
  success: z.boolean(),
  paymentUrl: z.string().url().optional(),
  error: z.string().optional(),
});

export type TipResponse = z.infer<typeof tipResponseSchema>;

export const validateAddressSchema = z.object({
  address: z.string(),
});

export type ValidateAddressRequest = z.infer<typeof validateAddressSchema>;

export const validateAddressResponseSchema = z.object({
  valid: z.boolean(),
  address: z.string().optional(),
  error: z.string().optional(),
});

export type ValidateAddressResponse = z.infer<typeof validateAddressResponseSchema>;

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FarcasterContext {
  user: FarcasterUser;
  client: {
    platformType?: "web" | "mobile";
    clientFid: number;
    added: boolean;
  };
  location?: {
    type: string;
  };
}
