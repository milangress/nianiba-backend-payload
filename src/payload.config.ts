import path from 'path'

import {payloadCloud} from '@payloadcms/plugin-cloud'
import {webpackBundler} from '@payloadcms/bundler-webpack'
import {buildConfig} from 'payload/config'
import {postgresAdapter} from '@payloadcms/db-postgres'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import Users from './collections/Users'
import {Pages} from "./collections/Pages";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: lexicalEditor({}),
  collections: [Users, Pages],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    }
  }),
})
