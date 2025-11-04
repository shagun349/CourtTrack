
import { dbPromise } from '../db.js';

async function getAllLawyers() {
  const db = await dbPromise;

  const [lawyers] = await db.query(`
    SELECT
      u.user_id AS id,
      u.name,
      u.email,
      COUNT(c.id) AS total_cases,
      SUM(CASE WHEN c.status = 'won' THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN c.status = 'lost' THEN 1 ELSE 0 END) AS losses
    FROM users u
    JOIN lawyers l ON u.user_id = l.user_id
    LEFT JOIN cases c ON u.user_id = c.lawyer_id
    GROUP BY u.user_id
  `);

  return lawyers;
}

export { getAllLawyers };
