
import { dbPromise } from '../db.js';

async function getAllLawyers(search) {
  const db = await dbPromise;

  let query = `
    SELECT
      u.user_id AS id,
      u.name,
      u.email,
      COUNT(c.id) AS total_cases,
      SUM(CASE WHEN c.status = 'won' THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN c.status = 'lost' THEN 1 ELSE 0 END) AS losses,
      SUM(CASE WHEN c.status = 'approved' THEN 1 ELSE 0 END) AS approved_cases,
      SUM(CASE WHEN c.status = 'rejected' THEN 1 ELSE 0 END) AS rejected_cases,
      (SUM(CASE WHEN c.status = 'approved' THEN 1 ELSE 0 END) / 
       NULLIF(SUM(CASE WHEN c.status = 'approved' THEN 1 ELSE 0 END) + 
              SUM(CASE WHEN c.status = 'rejected' THEN 1 ELSE 0 END), 0)) * 100 AS approval_rate
    FROM users u
    JOIN lawyers l ON u.user_id = l.user_id
    LEFT JOIN cases c ON u.user_id = c.lawyer_id
  `;

  const params = [];
  if (search) {
    query += ` WHERE u.name LIKE ? OR u.email LIKE ?`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ` GROUP BY u.user_id`;

  const [lawyers] = await db.query(query, params);

  return lawyers;
}

export { getAllLawyers };
