import pgPromise from 'pg-promise';
import { IDatabase } from 'pg-promise';
// import config from '../config/config'; // Load database configuration

// Create a PostgreSQL database connection
const pgp = pgPromise();

export function connectDatabase(): IDatabase<{}> {
    const db: IDatabase<{}> = pgp('postgres://myuser:mypassword@localhost:5432/mydb');
    return db;
}


