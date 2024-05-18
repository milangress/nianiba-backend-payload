import {defineConfig} from "drizzle-kit";

// export default defineConfig({
//     schema: "./src/payload-types.ts",
//     out: ".src/migrations",
//     dialect: 'postgresql',
//     dbCredentials: {
//         url: process.env.DATABASE_URI,
//     }
// });

export default defineConfig({
    schema: "./src/payload-types.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URI,
    },
    verbose: true,
    // strict: true,
})
