import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const coverFile = formData.get('cover') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const audioDir = join(uploadsDir, 'audio');
    const coversDir = join(uploadsDir, 'covers');

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    if (!existsSync(audioDir)) {
      await mkdir(audioDir, { recursive: true });
    }
    if (!existsSync(coversDir)) {
      await mkdir(coversDir, { recursive: true });
    }

    // Save audio file
    const audioBytes = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(audioBytes);
    const audioFileName = `${Date.now()}-${crypto.randomUUID()}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const audioPath = join(audioDir, audioFileName);
    await writeFile(audioPath, audioBuffer);
    const audioUrl = `/uploads/audio/${audioFileName}`;

    // Save cover file if provided
    let coverUrl = null;
    if (coverFile) {
      const coverBytes = await coverFile.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      const coverFileName = `${Date.now()}-${crypto.randomUUID()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const coverPath = join(coversDir, coverFileName);
      await writeFile(coverPath, coverBuffer);
      coverUrl = `/uploads/covers/${coverFileName}`;
    }

    return NextResponse.json({
      audioUrl,
      coverUrl,
      message: 'Files uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
