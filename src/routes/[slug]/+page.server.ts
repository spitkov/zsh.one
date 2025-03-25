import Database from 'better-sqlite3';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const db = new Database('posts.db');

export const load: PageServerLoad = async ({ params }) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(params.slug);
    
    if (!post) {
      throw error(404, 'Post not found');
    }

    return { post };
  } catch (e) {
    throw error(500, 'Failed to load post');
  }
}; 