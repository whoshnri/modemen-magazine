"use server";
import prisma from "@/lib/prisma";

const SECRET_KEY = process.env.PAYSTACK_API_KEY;

if (!SECRET_KEY) {
  throw new Error("PAYSTACK_API_KEY is missing in environment variables");
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: "Verification successful";
  data: PaystackTransactionData;
}

export interface PaystackTransactionData {
  id: number;
  domain: "test" | "live";
  status: "success" | "failed" | "abandoned";
  reference: string;
  receipt_number: string | null;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel:
  | "card"
  | "bank"
  | "ussd"
  | "qr"
  | "mobile_money"
  | "bank_transfer"
  | "eft";
  currency: string;
  ip_address: string;
  metadata: Record<string, any> | "";
  log: {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: string[];
    history: Array<{
      type: "action" | "success" | "error" | "info" | "close";
      message: string;
      time: number;
    }>;
  };
  fees: number;
  fees_split: any | null;
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: "card";
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
  };
  customer: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: any | null;
    risk_action: "default" | "allow" | "deny";
    international_format_phone: string | null;
  };
  plan: any | null;
  split: Record<string, any>;
  order_id: string | null;
  paidAt: string;
  createdAt: string;
  requested_amount: number;
  pos_transaction_data: any | null;
  source: any | null;
  fees_breakdown: any | null;
  connect: any | null;
  transaction_date: string;
  plan_object: Record<string, any>;
  subaccount: Record<string, any>;
}

type initResBody = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

async function storeReference(ref: string, id: string) {
  try {
    prisma.order.update({
      where: {
        id: id
      },
      data: {
        reference: ref
      }
    })
    return true
  } catch (err) {
    console.log(err)
    return false

  }

}


export async function verifyPayment(reference: string) {
  if (!reference?.trim()) {
    console.error("[Paystack Verify] Missing reference");
    return {
      message: "Failed To verify transaction", data: null, status : false
    };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Paystack Verify] HTTP ${response.status} - ${errorText}`);
      return {
        status : false, data : null, message : "Verification error"
      };
    }

    const payLoadJson: PaystackVerificationResponse = await response.json();

    if (payLoadJson.status === true) {
      return {
        status : true, message : payLoadJson.message , data: payLoadJson.data
      }
    } else {
      return {
        status : false, message : payLoadJson.message , data: payLoadJson.data
      }
    }

    
  } catch (error) {
    console.error(
      "[Paystack Verify] Exception -",
      error instanceof Error ? error.message : error
    );
  }
}
