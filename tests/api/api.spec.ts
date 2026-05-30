/**
 * API tests against Automation Exercise public endpoints using Playwright request context.
 */
import { expect, test } from '@playwright/test';

const API_BASE_URL = 'https://automationexercise.com/api' as const;

const INVALID_LOGIN_PAYLOAD = {
  email: 'wrong@test.com',
  password: 'wrongpass',
} as const;

interface ApiCategory {
  usertype: string | { category: string };
  category: string;
}

interface ApiProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ApiCategory;
}

interface ProductsListResponse {
  responseCode: number;
  products: ApiProduct[];
}

interface VerifyLoginResponse {
  responseCode: number;
  message: string;
}

test.describe('Automation Exercise API', () => {
  test('GET productsList returns 200 with non-empty products array', async ({
    request,
  }) => {
    let body: ProductsListResponse;

    await test.step('Request products list', async () => {
      const response = await request.get(`${API_BASE_URL}/productsList`);

      expect.soft(response.status(), 'HTTP status should be 200').toBe(200);

      body = (await response.json()) as ProductsListResponse;
    });

    await test.step('Validate products list response body', async () => {
      expect.soft(body.responseCode, 'API responseCode should be 200').toBe(200);
      expect.soft(Array.isArray(body.products), 'products should be an array').toBe(
        true,
      );
      expect
        .soft(body.products.length, 'products array should not be empty')
        .toBeGreaterThan(0);

      const firstProduct = body.products[0];
      expect.soft(firstProduct, 'first product should be defined').toBeDefined();
      expect.soft(typeof firstProduct.id, 'product id should be a number').toBe(
        'number',
      );
      expect.soft(typeof firstProduct.name, 'product name should be a string').toBe(
        'string',
      );
      expect
        .soft(typeof firstProduct.brand, 'product brand should be a string')
        .toBe('string');
      expect
        .soft(firstProduct.category, 'product should include category metadata')
        .toBeTruthy();
      expect
        .soft(typeof firstProduct.category.category, 'category name should be a string')
        .toBe('string');
    });
  });

  test('POST verifyLogin with invalid credentials returns responseCode 404', async ({
    request,
  }) => {
    let body: VerifyLoginResponse;

    await test.step('Submit invalid login credentials', async () => {
      const response = await request.post(`${API_BASE_URL}/verifyLogin`, {
        form: {
          email: INVALID_LOGIN_PAYLOAD.email,
          password: INVALID_LOGIN_PAYLOAD.password,
        },
      });

      expect.soft(response.status(), 'HTTP status should be 200').toBe(200);

      body = (await response.json()) as VerifyLoginResponse;
    });

    await test.step('Validate verifyLogin error response body', async () => {
      expect
        .soft(body.responseCode, 'API responseCode should be 404 for invalid login')
        .toBe(404);
      expect
        .soft(typeof body.message, 'error response should include a message')
        .toBe('string');
      expect
        .soft(body.message.length, 'error message should not be empty')
        .toBeGreaterThan(0);
    });
  });
});
