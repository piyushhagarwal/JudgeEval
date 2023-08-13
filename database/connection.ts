import { Client } from "pg";

async function queryDatabase(query: string, params: any[] = []): Promise<any> {
  const client = new Client({
    user: "myuser",
    host: "localhost",
    database: "mydb",
    password: "mypassword",
    port: 5432,
  });

  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default queryDatabase;
