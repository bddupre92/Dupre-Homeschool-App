// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@cloudflare/next-on-pages';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { DB } = getCloudflareContext().env;
    const postId = params.id;
    
    // Get post by ID
    const post = await DB.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(postId).first();
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { DB } = getCloudflareContext().env;
    const postId = params.id;
    const data = await request.json();
    
    // Check if post exists
    const existingPost = await DB.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(postId).first();
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update post
    const now = Date.now();
    
    const query = `
      UPDATE Posts SET
        title = ?,
        description = ?,
        mediaType = ?,
        mediaUrl = ?,
        grades = ?,
        subjects = ?,
        approaches = ?,
        updatedAt = ?
      WHERE id = ?
    `;
    
    const params = [
      data.title || existingPost.title,
      data.description || existingPost.description,
      data.mediaType || existingPost.mediaType,
      data.mediaUrl || existingPost.mediaUrl,
      data.grades || existingPost.grades,
      data.subjects || existingPost.subjects,
      data.approaches || existingPost.approaches,
      now,
      postId
    ];
    
    await DB.prepare(query).bind(...params).run();
    
    // Return the updated post
    const updatedPost = await DB.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(postId).first();
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { DB } = getCloudflareContext().env;
    const postId = params.id;
    
    // Check if post exists
    const existingPost = await DB.prepare(`
      SELECT * FROM Posts WHERE id = ?
    `).bind(postId).first();
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete post
    await DB.prepare(`
      DELETE FROM Posts WHERE id = ?
    `).bind(postId).run();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
