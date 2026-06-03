import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { content, sessionId, date, type, clientName } = req.body;
    // type: 'internal' | 'external'

    if (!content || !date) {
      return res.status(400).json({ error: 'content and date are required' });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const shortId = sessionId ? String(sessionId).slice(0, 8) : 'unknown';
    const client = clientName || shortId;

    const folderId = type === 'external'
      ? process.env.GOOGLE_DRIVE_EXTERNAL_FOLDER_ID
      : process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileName = type === 'external'
      ? `${client}_需求確認_${date}`
      : `${client}_訪談紀錄_${date}`;

    if (!folderId) {
      return res.status(500).json({ error: `Missing folder ID for type: ${type}` });
    }

    const file = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/vnd.google-apps.document',
        parents: [folderId],
      },
      media: {
        mimeType: 'text/plain',
        body: content,
      },
      fields: 'id, webViewLink',
    });

    return res.status(200).json({
      success: true,
      fileId: file.data.id,
      fileUrl: file.data.webViewLink,
    });

  } catch (error) {
    console.error('Save doc error:', error);
    return res.status(500).json({
      error: 'Failed to save document',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}