import { getSession, Session } from '@auth0/nextjs-auth0';
import { loadEnvConfig } from '@next/env';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from 'typeorm';
import Home from '../../src/entities/home';
import Task from '../../src/entities/task';
import TaskReceipt from '../../src/entities/taskreceipt';
import TaskSeries from '../../src/entities/taskseries';
import TaskType from '../../src/entities/tasktype';
import User from '../../src/entities/user';
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

export const timeoutLength = 300000;

export const database = {
  async reset() {
    await databaseConnection();
    await getConnection().synchronize(true);
  },

  async shutdown() {
    await getConnection().close();
  },

  async insertUsers(count = 3) {
    await databaseConnection();

    for (let i = 1; i <= count; i++) {
      const user = new User();
      user.id = 'user-' + i.toString();
      user.name = 'name-' + i.toString();
      user.picture = 'picture-' + i.toString();
      await user.save();
    }
  },

  async insertHomes(count = 3) {
    await databaseConnection();

    for (let i = 1; i <= count; i++) {
      const home = new Home();
      home.name = 'name-' + i.toString();
      home.code = 'code-' + i.toString();
      await home.save();
    }
  },

  async insertTaskTypes(count = 3, home?: string) {
    await databaseConnection();

    const homeEntity = await Home.findOneOrFail(home);

    for (let i = 1; i <= count; i++) {
      const taskType = new TaskType('name-' + i.toString(), i, homeEntity);
      await taskType.save();
    }
  },

  async insertTasks(count = 3, type?: string, start = new Date('2022-01-01')) {
    await databaseConnection();

    const typeEntity = await TaskType.findOneOrFail(type, {
      relations: ['relatedHome'],
    });
    const homeEntity = typeEntity.relatedHome;
    const date = start;

    for (let i = 1; i <= count; i++) {
      date.setDate(date.getDate() + (count - 1));

      const task = new Task(date, homeEntity as Home, typeEntity);
      await task.save();
    }
  },

  async insertTaskSeries(
    count = 3,
    type?: string,
    start = new Date('2022-01-01'),
    interval = 1,
    iterations = 4
  ) {
    await databaseConnection();

    const typeEntity = await TaskType.findOneOrFail(type, {
      relations: ['relatedHome'],
    });
    const homeEntity = typeEntity.relatedHome;
    const date = start;

    for (let i = 1; i <= count; i++) {
      date.setDate(date.getDate() + (count - 1) * 365);

      const taskSeries = new TaskSeries(homeEntity as Home);
      await taskSeries.save();

      for (let i = 0; i < iterations; i++) {
        const taskDate = date;
        taskDate.setDate(taskDate.getDate() + i * 7 * interval);

        const task = new Task(date, homeEntity as Home, typeEntity);
        task.series = taskSeries;
        await task.save();
      }
    }
  },

  async insertReceipt(user: string, task: string) {
    await databaseConnection();

    const userEntity = await User.findOneOrFail(user);
    const taskEntity = await Task.findOneOrFail(task, {
      relations: ['type', 'relatedHome'],
    });
    const homeEntity = taskEntity.relatedHome as Home;
    const typeEntity = taskEntity.type as TaskType;

    const receipt = new TaskReceipt(
      homeEntity,
      userEntity,
      typeEntity.name,
      typeEntity.points
    );

    await receipt.save();

    taskEntity.receipt = receipt;
    await taskEntity.save();
  },

  async addUserToHome(user: string, home: string) {
    await databaseConnection();

    const userEntity = await User.findOneOrFail(user);
    userEntity.home = await Home.findOneOrFail(home);

    await userEntity.save();
  },

  assignUserToTask: async (user: string, task: string) => {
    await databaseConnection();

    const taskEntity = await Task.findOneOrFail(task);
    taskEntity.assignee = await User.findOneOrFail(user);

    await taskEntity.save();
  },
};
