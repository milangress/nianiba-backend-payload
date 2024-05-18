import {defineConfig} from "drizzle-kit";
import payload from "payload";

// export default defineConfig({
//     schema: "./src/payload-types.ts",
//     out: ".src/migrations",
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: process.env.DATABASE_URI,
//     }
// });

console.log(process.env.DATABASE_URI);
console.log(payload.db.tables)

export default defineConfig({
    schema: "./src/payload-types.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URI,
    },
    verbose: true,
    // strict: true,
})
