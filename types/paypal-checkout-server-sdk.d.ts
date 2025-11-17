declare module '@paypal/checkout-server-sdk' {
  namespace core {
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }

    class PayPalHttpClient {
      constructor(environment: SandboxEnvironment | LiveEnvironment);
      execute<T = any>(request: any): Promise<PayPalResponse<T>>;
    }
  }

  namespace orders {
    class OrdersCreateRequest {
      constructor();
      requestBody(body: any): void;
      prefer(prefer: string): void;
    }

    class OrdersCaptureRequest {
      constructor(orderId: string);
      requestBody(body: any): void;
    }

    class OrdersGetRequest {
      constructor(orderId: string);
    }
  }

  interface PayPalResponse<T = any> {
    statusCode: number;
    result: T;
    headers?: Record<string, string>;
  }

  const paypal: {
    core: typeof core;
    orders: typeof orders;
  };

  export = paypal;
}

