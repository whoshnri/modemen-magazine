declare module '@paystack/inline-js' {
  /**
   * Interface representing the response object returned by the onLoad callback.
   */
  export interface OnLoadResponse {
    id: string;
    accessCode: string;
    customer: {
      [key: string]: any; // Customer details object
    };
  }

  /**
   * Interface representing the transaction object returned by the onSuccess callback.
   */
  export interface OnSuccessTransaction {
    reference: string;
    trans: string; // For backward compatibility
    status: string;
    message: string;
    transaction: string;
    trxref: string; // For backward compatibility
    [key: string]: any; // Additional transaction properties
  }

  /**
   * Interface representing the error object passed to the onError callback.
   */
  export interface PaystackError {
    message: string;
    [key: string]: any;
  }

  /**
   * Interface for general transaction request options.
   */
  export interface TransactionOptions {
    key: string;
    amount: number;
    email: string;
    currency?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    customerCode?: string;
    channels?: Array<'card' | 'bank' | 'ussd' | 'qr' | 'eft' | 'mobile_money' | 'bank_transfer' | 'apple_pay'>;
    metadata?: Record<string, any>;
    reference?: string;
  }

  /**
   * Interface for split payment options.
   */
  export interface SplitPaymentOptions {
    subaccountCode: string;
    bearer?: 'account' | 'subaccount';
    transactionCharge?: number;
  }

  /**
   * Interface for multi-split payment configuration.
   */
  export interface MultiSplitOptions {
    type: 'flat' | 'percentage';
    bearer_type: 'all' | 'all-proportional' | 'account' | 'subaccount';
    subaccounts: Array<{
      subaccount: string;
      share: number;
    }>;
    bearer_subaccount?: string;
    reference?: string;
  }

  /**
   * Interface for subscription options.
   */
  export interface SubscriptionOptions {
    planInterval: 'daily' | 'weekly' | 'monthly' | 'annually';
    subscriptionLimit?: number;
    subscriptionStartDate?: string;
  }

  /**
   * Interface for plan-based subscription.
   */
  export interface PlanSubscriptionOptions {
    planCode: string;
    subscriptionCount?: number;
  }

  /**
   * Interface for payment request (wallet) options.
   */
  export interface PaymentRequestOptions extends TransactionOptions {
    container: string;
    loadPaystackCheckoutButton?: string;
    styles?: {
      theme?: 'dark' | 'light';
      applePay?: {
        width?: string;
        height?: string;
        borderRadius?: string;
        type?: string;
        locale?: string;
      };
    };
  }

  /**
   * Interface for Apple Pay button styles.
   */
  export interface ApplePayStyles {
    width?: string;
    height?: string;
    borderRadius?: string;
    type?: string;
    locale?: string;
  }

  /**
   * Interface for styles object in paymentRequest.
   */
  export interface Styles {
    theme?: 'dark' | 'light';
    applePay?: ApplePayStyles;
  }

  /**
   * Paystack InlineJS class.
   */
  export default class Paystack {
    /**
     * Constructor for Paystack instance.
     */
    constructor();

    /**
     * Synchronous method to create a transaction.
     * @param options - Transaction configuration options.
     */
    newTransaction(options: TransactionOptions & {
      onSuccess?: (transaction: OnSuccessTransaction) => void;
      onLoad?: (response: OnLoadResponse) => void;
      onCancel?: () => void;
      onError?: (error: PaystackError) => void;
    }): void;

    /**
     * Asynchronous method to create a transaction.
     * @param options - Transaction configuration options.
     */
    checkout(options: TransactionOptions & {
      onSuccess?: (transaction: OnSuccessTransaction) => void;
      onLoad?: (response: OnLoadResponse) => void;
      onCancel?: () => void;
      onError?: (error: PaystackError) => void;
    }): Promise<void>;

    /**
     * Resume a transaction using an access code from backend initialization.
     * @param accessCode - The access code returned from the initialize endpoint.
     */
    resumeTransaction(accessCode: string): void;

    /**
     * Cancel a transaction by ID.
     * @param id - The transaction ID to cancel.
     */
    cancelTransaction(id: string): void;

    /**
     * Preload a transaction in the background for instant popup loading.
     * @param options - Transaction configuration options.
     * @returns A function that opens the preloaded popup when called.
     */
    preloadTransaction(options: TransactionOptions): () => void;

    /**
     * Initialize a payment request for wallet payments (e.g., Apple Pay).
     * @param options - Payment request configuration including container and styles.
     * @param onElementsMount - Callback triggered when elements are mounted.
     */
    paymentRequest(
      options: PaymentRequestOptions,
      onElementsMount?: (elements: { applePay: boolean } | null) => void
    ): Promise<void>;

    /**
     * Callback triggered when the transaction is successfully loaded and the popup is visible.
     */
    onLoad?: (response: OnLoadResponse) => void;

    /**
     * Callback triggered when the customer successfully completes a transaction.
     */
    onSuccess?: (transaction: OnSuccessTransaction) => Promise<void>;

    /**
     * Callback triggered when the Apple Pay button has been mounted.
     */
    onElementsMount?: (elements: { applePay: boolean } | null) => void;

    /**
     * Callback triggered when the transaction is cancelled by the user.
     */
    onCancel?: () => Promise<void>;

    /**
     * Callback triggered when there is an error loading the transaction.
     */
    onError?: (error: PaystackError) => void;
  }
}