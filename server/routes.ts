import type { Express } from "express";
import { createServer, type Server } from "http";
import { tipRequestSchema, validateAddressSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/tip", async (req, res) => {
    try {
      const validatedData = tipRequestSchema.parse(req.body);
      
      const paymentUrl = generatePaymentUrl(
        validatedData.targetAddress,
        validatedData.amount,
        validatedData.currency
      );
      
      res.json({
        success: true,
        paymentUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as any;
        res.status(400).json({
          success: false,
          error: zodError.errors?.[0]?.message || "Invalid request data",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to generate payment link",
        });
      }
    }
  });

  app.post("/api/validate-address", async (req, res) => {
    try {
      const { address } = validateAddressSchema.parse(req.body);
      
      const isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      
      if (isValid) {
        res.json({
          valid: true,
          address: address.toLowerCase(),
        });
      } else {
        res.status(400).json({
          valid: false,
          error: "Invalid Ethereum address format",
        });
      }
    } catch (error) {
      res.status(400).json({
        valid: false,
        error: "Invalid request",
      });
    }
  });

  app.get("/api/health", (_, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}

function generatePaymentUrl(
  targetAddress: string,
  amount: string,
  currency: string
): string {
  const baseUrl = `https://pay.send.it/${targetAddress}`;
  const params = new URLSearchParams();
  
  params.append("amount", amount);
  
  if (currency === "USDC") {
    params.append("token", "usdc");
  }
  
  return `${baseUrl}?${params.toString()}`;
}
