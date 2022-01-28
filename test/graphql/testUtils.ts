import { getSession, Session } from '@auth0/nextjs-auth0';
import { loadEnvConfig } from '@next/env';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from 'typeorm';
import { User } from '../../src/entities';
import databaseConnection from '../../src/lib/typeorm/connection';
import graphql from '../../src/pages/api/graphql';

// Mock authentication
jest.mock('@auth0/nextjs-auth0');
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

/**
 * Test a graphql request.
 * @param body The request body.
 * @param userId The id of the authenticated user (mocked).
 * @returns The response mock functions.
 */
export async function testGraphql(
  body: { operationName: string; query: string; variables: any },
  userId = ''
) {
  // Build request
  const req = new IncomingMessage(new Socket()) as NextApiRequest;
  req.body = JSON.stringify(body);
  req.method = 'POST';
  req.url = '/api/graphql';
  req.headers = {
    'content-type': 'application/json',
    'content-length': req.body.length.toString(),
  };
  req.cookies = { userId };

  // Mock getSession implementation: read user id from cookie
  mockedGetSession.mockImplementation((req) => {
    const nextReq = req as NextApiRequest;
    const sub = nextReq.cookies.userId;
    if (sub) {
      const session = { user: { sub } };
      return session as Session;
    } else {
      return null;
    }
  });

  // Mock response functions
  const res = {
    setHeader: jest.fn(),
    end: jest.fn(),
  };

  // Async data and end for raw-body package
  setTimeout(() => {
    req.emit('data', Buffer.from(req.body));
    req.emit('end');
  });

  // Test
  await graphql(req, res as unknown as NextApiResponse);

  // Return response
  return res;
}

export const database = {
  reset: async () => {
    await databaseConnection();
    await getConnection().synchronize(true);
  },

  insertUsers: async (count = 3) => {
    await databaseConnection();

    for (let i = 1; i <= count; i++) {
      const user = new User();
      user.id = 'user-' + i.toString();
      user.name = 'name-' + i.toString();
      user.picture = 'picture-' + i.toString();
      await user.save();
    }
  },
};
