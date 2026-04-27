import { beforeEach, describe, expect, it, vi } from 'vitest';

let requestMock = vi.fn();
const getRequestMock = () => requestMock;

vi.mock('../libs/firebaseClient', () => ({
  firebaseAuth: { currentUser: null },
  signOutFromFirebase: vi.fn(),
}));

vi.mock('axios', () => {
  return {
    default: {
      create: () => {
        const instance: any = (config: any) => instance.request(config);
        instance.request = (config: any) => getRequestMock()(config);
        instance.interceptors = {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        };
        return instance;
      },
    },
  };
});

import api, { http, apiClient } from '../utils/api';

describe('api helper', () => {
  beforeEach(() => {
    requestMock.mockReset();
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
    expect(requestMock).toHaveBeenCalledWith({ method: 'GET', url: '/hello' });
  });
});