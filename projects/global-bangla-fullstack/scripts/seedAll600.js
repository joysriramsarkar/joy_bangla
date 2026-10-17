// Seed 500 new initiatives into SQLite database
const { db } = require('../db');
const newItems = require('../data_pillars');

console.log('Inserting', newItems.length, 'new initiatives into database...');

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO initiatives (code, pillar_id, pillar_name, title, short_desc, full_desc, status, priority, target_year, votes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
for (const item of newItems) {
  const result = insertStmt.run(
    item.code,
    item.pillar_id,
    item.pillar_name,
    item.title,
    item.short_desc,
    item.full_desc,
    item.status,
    item.priority,
    item.target_year,
    item.votes || 0
  );
  if (result.changes > 0) {
    inserted++;
  }
}

const finalCount = db.prepare('SELECT COUNT(*) as count FROM initiatives').get();
console.log(`Successfully inserted ${inserted} new items.`);
console.log(`Total initiatives in DB: ${finalCount.count}`);
