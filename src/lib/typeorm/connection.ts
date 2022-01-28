import 'reflect-metadata';
import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
} from 'typeorm';
import entities from '../../entities/entities';

async function createDatabaseConnection(retries = 5): Promise<Connection> {
  if (retries <= 0)
    throw new Error('Could not establish a database connection!');

  const ormConfig: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    synchronize: true,
    logging: false,
    entities,
  };

  try {
    return createConnection(ormConfig);
  } catch (error) {
    retries--;
    console.warn(
      `Database connection failed. Retries left: ${retries}.`,
      error
    );
    // Wait 5 seconds and try again
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return createDatabaseConnection(retries);
  }
}

let connected = false;

export default async function databaseConnection() {
  if (!connected) {
    try {
      // Clean up old connection that references outdated hot-reload classes
      const staleConnection = getConnection();
      await staleConnection.close();
    } catch (error) {
      // No stale connection to clean up
    }

    // Wait for new default connection
    await createDatabaseConnection();
    connected = true;
  }
}
