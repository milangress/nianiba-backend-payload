import type {CollectionConfig} from 'payload/types'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {publishedOrLoggedIn} from "../access/publishedOrLoggedIn";
import {loggedIn} from "../access/loggedIn";
import formatSlug from "../hooks/formatSlug";
import {formatAppURL, revalidatePage} from "../hooks/revalidatePage";
import link from "../fields/link";

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'updatedAt'],
        preview: doc => {
            return `${process.env.PAYLOAD_PUBLIC_SITE_URL}/api/preview?url=${encodeURIComponent(
                formatAppURL({
                    doc,
                }),
            )}&collection=pages&slug=${doc.slug}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
        },
    },
    access: {
        read: publishedOrLoggedIn,
        create: loggedIn,
        update: loggedIn,
        delete: loggedIn,
    },
    versions: {
        drafts: true,
    },
    hooks: {
        afterChange: [revalidatePage],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            index: true,
            admin: {
                readOnly: true,
                // position: 'sidebar',
            },
            hooks: {
                beforeValidate: [formatSlug('title')],
            },
        },
        {
            name: 'content',
            type: 'richText',
            // Pass the Lexical editor here and override base settings as necessary
            editor: lexicalEditor({})
        },
        link({})
    ]
}
