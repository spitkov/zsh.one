import { json } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import type { RequestHandler } from './$types';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

if (existsSync('posts.db')) {
  await unlink('posts.db');
}

const db = new Database('posts.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, content } = await request.json();
    if (!content?.trim() || !title?.trim()) {
      return json({ error: 'Title and content are required' }, { status: 400 });
    }

    const slug = Math.random().toString(36).substring(2, 8);
    
    const stmt = db.prepare('INSERT INTO posts (slug, title, content) VALUES (?, ?, ?)');
    stmt.run(slug, title, content);
    
    const post = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
    return json({ post, slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return json({ error: 'Failed to create post' }, { status: 500 });
  }
}; 