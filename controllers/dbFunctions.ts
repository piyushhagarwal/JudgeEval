import queryDatabase from '../database/connection';

export async function updateTeamDetails(id: number, name: string, members: string) {
    const query = 'UPDATE teams SET name = $1, members = $2 WHERE id = $3 RETURNING *';
    return queryDatabase(query, [name, members, id]);
}