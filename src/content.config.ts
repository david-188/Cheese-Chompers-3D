import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const games = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/games', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		slug: z.string().optional(),
		isHot: z.boolean().optional(),
		title: z.string(),
		description: z.string(),
		category: z.string(),
		tags: z.array(z.string()).optional(),
		embed: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});


const categories = defineCollection({
	loader: glob({ base: './src/content/categories', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		description: z.string(),
		icon: z.string().optional(),
	}),
});

export const collections = { games, categories };
