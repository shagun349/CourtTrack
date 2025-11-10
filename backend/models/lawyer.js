
import { dbPromise } from '../db.js';

async function getAllLawyers(search, { minApprovalRate, minWins, minCases }) {
  const db = await dbPromise;

  let query = `
    SELECT
      u.user_id AS id,
      u.name,
      u.email,
      COALESCE(cases_stats.total_cases, 0) AS total_cases,
      COALESCE(cases_stats.wins, 0) AS wins,
      COALESCE(cases_stats.losses, 0) AS losses,
      (COALESCE(cases_stats.approved_cases, 0) / NULLIF(COALESCE(cases_stats.approved_cases, 0) + COALESCE(cases_stats.rejected_cases, 0), 0)) * 100 AS approval_rate
    FROM users u
    JOIN lawyers l ON u.user_id = l.user_id
    LEFT JOIN (
      SELECT
        lawyer_id,
        COUNT(id) AS total_cases,
        SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_cases,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_cases
      FROM cases
      GROUP BY lawyer_id
    ) AS cases_stats ON u.user_id = cases_stats.lawyer_id
  `;

  const params = [];
  let whereClauses = [];

  if (search) {
    whereClauses.push(`(u.name LIKE ? OR u.email LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  let havingClauses = [];
  if (minApprovalRate) {
    havingClauses.push(`approval_rate >= ?`);
    params.push(minApprovalRate);
  }
  if (minWins) {
    havingClauses.push(`wins >= ?`);
    params.push(minWins);
  }
  if (minCases) {
    havingClauses.push(`total_cases >= ?`);
    params.push(minCases);
  }

  if (havingClauses.length > 0) {
    query += ` HAVING ${havingClauses.join(' AND ')}`;
  }

  console.log('Generated SQL:', query);
  console.log('Query params:', params);

  const [lawyers] = await db.query(query, params);

  return lawyers;
}

export { getAllLawyers };
