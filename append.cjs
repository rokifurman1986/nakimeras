const fs = require('fs');

// Append to supabase_seed.sql
let sqlContent = fs.readFileSync('supabase_seed.sql', 'utf8');
const sqlItems = fs.readFileSync('output_sql.txt', 'utf8');
sqlContent = sqlContent.replace(/\);\s*$/, '),\n' + sqlItems + ';\n');
fs.writeFileSync('supabase_seed.sql', sqlContent);

// Append to products.ts
let tsContent = fs.readFileSync('src/data/products.ts', 'utf8');
const tsItems = fs.readFileSync('output_ts.txt', 'utf8');
tsContent = tsContent.replace(/};\s*\];/, '},\n' + tsItems + '\n];');
fs.writeFileSync('src/data/products.ts', tsContent);

console.log("Appended both.");
