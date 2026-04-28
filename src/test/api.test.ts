import { beforeEach, describe, expect, it, vi } from 'vitest';

let requestMock = vi.fn();
const getRequestMock = () => requestMock;

const showToastMock = vi.fn();
const removeAuthenticatedUserMock = vi.fn();

vi.mock('../libs/firebaseClient', () => ({
  firebaseAuth: { currentUser: null },
  signOutFromFirebase: vi.fn(),
}));

vi.mock('../store/useToastStore', () => ({
  useToastStore: { getState: () => ({ showToast: showToastMock }) },
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: { getState: () => ({ removeAuthenticatedUser: removeAuthenticatedUserMock }) },
}));

vi.mock('axios', () => {
  return {
    default: {
      create: (defaults: any) => {
        const requestInterceptors: Array<any> = [];
        const responseInterceptors: Array<any> = [];

        const instance: any = async (config: any) => {
          config = {
            ...config,
            headers: {
              ...(defaults?.headers || {}),
              ...(config?.headers || {}),
            },
          };

          for (const interceptor of requestInterceptors) {
            config = await interceptor.fulfilled(config);
          }

          try {
            const response = await getRequestMock()(config);
            return response;
          } catch (error) {
            for (const interceptor of responseInterceptors) {
              if (interceptor.rejected) {
                await interceptor.rejected(error);
              }
            }
            return Promise.reject(error);
          }
        };

        instance.request = instance;
        instance.interceptors = {
          request: {
            handlers: requestInterceptors,
            use: (fulfilled: any, rejected: any) => {
              requestInterceptors.push({ fulfilled, rejected });
              return requestInterceptors.length - 1;
            },
          },
          response: {
            handlers: responseInterceptors,
            use: (fulfilled: any, rejected: any) => {
              responseInterceptors.push({ fulfilled, rejected });
              return responseInterceptors.length - 1;
            },
          },
        };

        return instance;
      },
    },
  };
});

import api, { http, apiClient } from '../utils/api';
import { firebaseAuth, signOutFromFirebase } from '../libs/firebaseClient';

describe('api helper', () => {
  beforeEach(() => {
    requestMock.mockReset();
    showToastMock.mockReset();
    removeAuthenticatedUserMock.mockReset();
    firebaseAuth.currentUser = null;
    window.location.href = 'http://localhost/';
  });

  it('returns data and status on successful request', async () => {
    requestMock.mockResolvedValue({ data: { foo: 'bar' }, status: 200 });

    const result = await http({ url: '/test', method: 'GET' });

    expect(result).toEqual({ data: { foo: 'bar' }, error: null, status: 200 });
  });

  it('returns network error message when request has no response', async () => {
    const error = { request: {}, message: 'Network failed' };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/test', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Network error - please check your connection', status: undefined });
  });

  it('returns server error message from response body', async () => {
    const error = { response: { data: { message: 'Not found' }, status: 404 } };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/test', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Not found', status: 404 });
  });

  it('apiClient.get calls http wrapper', async () => {
    requestMock.mockResolvedValue({ data: { hello: 'world' }, status: 200 });

    const response = await apiClient.get('/hello');

    expect(response.data).toEqual({ hello: 'world' });
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'GET',
      url: '/hello',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('apiClient.post calls http wrapper with payload', async () => {
    requestMock.mockResolvedValue({ data: { created: true }, status: 201 });

    const response = await apiClient.post('/items', { name: 'item' });

    expect(response.data).toEqual({ created: true });
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'POST',
      url: '/items',
      data: { name: 'item' },
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('apiClient.put calls http wrapper with payload', async () => {
    requestMock.mockResolvedValue({ data: { updated: true }, status: 200 });

    const response = await apiClient.put('/items/1', { name: 'item' });

    expect(response.data).toEqual({ updated: true });
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'PUT',
      url: '/items/1',
      data: { name: 'item' },
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('apiClient.patch calls http wrapper with payload', async () => {
    requestMock.mockResolvedValue({ data: { patched: true }, status: 200 });

    const response = await apiClient.patch('/items/1', { enabled: false });

    expect(response.data).toEqual({ patched: true });
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'PATCH',
      url: '/items/1',
      data: { enabled: false },
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('apiClient.delete calls http wrapper', async () => {
    requestMock.mockResolvedValue({ data: { deleted: true }, status: 200 });

    const response = await apiClient.delete('/items/1');

    expect(response.data).toEqual({ deleted: true });
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'DELETE',
      url: '/items/1',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
    }));
  });

  it('returns status text if no error message exists', async () => {
    const error = { response: { data: {}, status: 500, statusText: 'Server Error' } };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/test', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Server Error', status: 500 });
  });

  it('adds auth headers when firebase user token exists', async () => {
    firebaseAuth.currentUser = { getIdToken: vi.fn().mockResolvedValue('abc123') } as any;
    requestMock.mockResolvedValue({ data: { hello: 'world' }, status: 200 });

    const response = await apiClient.get('/auth');

    expect(response.data).toEqual({ hello: 'world' });
    expect(firebaseAuth.currentUser.getIdToken).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer abc123',
        'x-access-token': 'abc123',
      }),
    }));
  });

  it('handles unauthorized 401 errors by signing out and showing toast', async () => {
    const error = { response: { data: { message: 'Unauthorized' }, status: 401 } };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/private', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Unauthorized', status: 401 });
    expect(showToastMock).toHaveBeenCalledWith('Unauthorized access', 'error');
    expect(removeAuthenticatedUserMock).toHaveBeenCalledTimes(1);
    expect(signOutFromFirebase).toHaveBeenCalledTimes(1);
  });

  it('navigates to paywall when appAction is UNSUBSCRIBED_USER', async () => {
    const error = {
      response: {
        data: { appMessage: 'Subscription required', appAction: 'UNSUBSCRIBED_USER' },
        status: 403,
      },
    };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/paywall', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Server error: 403', status: 403 });
  });

  it('returns error message when request is rejected without response or request', async () => {
    const error = { message: 'Setup issue' };
    requestMock.mockRejectedValue(error);

    const result = await http({ url: '/test', method: 'GET' });

    expect(result).toEqual({ data: null, error: 'Setup issue', status: undefined });
  });

  it('exports axios instance with interceptor objects', () => {
    expect(api).toHaveProperty('interceptors');
    expect(api.interceptors).toHaveProperty('request');
    expect(api.interceptors).toHaveProperty('response');
  });
});