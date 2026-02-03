# AppMusic - Advanced Features

This document describes the advanced features implemented in AppMusic.

## 1. Upload System

### Location
- **UI**: `/app/(dashboard)/upload/page.tsx`
- **API**: `/app/api/upload/route.ts`

### Features
- Drag & drop audio file upload (MP3, WAV, FLAC, M4A)
- Automatic metadata extraction (duration, title, artist from filename)
- Cover image upload (JPG, PNG, WebP)
- Form validation with React Hook Form
- Progress indicator during upload
- Files saved to `/public/uploads/audio` and `/public/uploads/covers`

### Usage
1. Navigate to `/upload` in the sidebar
2. Drag and drop an audio file or click to browse
3. Fill in song details (title and artist are required)
4. Optionally add cover image and lyrics
5. Click "Upload Song"

## 2. Audio Visualizer

### Location
- **Component**: `/components/player/AudioVisualizer.tsx`

### Features
- Real-time audio visualization using Web Audio API
- Three visualization styles: Bars, Wave, Circular
- Canvas-based rendering with frequency data
- Toggle from PlayerBar

### Usage
Click the Activity icon (📊) in the PlayerBar to open the visualizer dialog.

## 3. Equalizer

### Location
- **Component**: `/components/player/Equalizer.tsx`

### Features
- 5-band equalizer (60Hz, 230Hz, 910Hz, 4kHz, 14kHz)
- Gain control from -12dB to +12dB per band
- Presets: Normal, Bass Boost, Treble Boost, Vocal
- Real-time audio filtering using Web Audio API

### Usage
Click the Sliders icon in the PlayerBar to open the equalizer dialog.

## 4. Lyrics Display

### Location
- **Component**: `/components/player/LyricsPanel.tsx`

### Features
- Display song lyrics in a side panel
- Auto-scroll with playback (basic implementation)
- Empty state for songs without lyrics
- Lyrics stored in Song model

### Usage
1. Add lyrics when uploading a song
2. Click the FileText icon in the PlayerBar to view lyrics

## 5. Statistics & Listening History

### Location
- **UI**: `/app/(dashboard)/stats/page.tsx`
- **APIs**: 
  - `/app/api/stats/route.ts` - Get user statistics
  - `/app/api/history/route.ts` - Listening history CRUD

### Features
- Top songs by play count
- Total listening time
- Favorite genres
- Recent listening history
- Play count tracking
- Visual statistics cards

### Database Models
- `ListeningHistory`: Tracks each song play with timestamp
- `Song.playCount`: Counter for total plays
- `Song.lyrics`: Optional lyrics field

### Usage
Navigate to `/stats` in the sidebar to view your statistics.

## 6. Share Feature

### Location
- **Component**: `/components/shared/ShareDialog.tsx`

### Features
- Copy shareable link to clipboard
- Share on social media (Twitter, Facebook)
- Share via email
- Toast notification on copy
- Works for songs and playlists

### Usage
```tsx
import { ShareButton } from "@/components/shared/ShareDialog";

<ShareButton 
  title="Song Name" 
  type="song" 
  id="song-id" 
/>
```

## 7. Additional Enhancements

### Loading Skeletons
- **Component**: `/components/shared/LoadingSkeletons.tsx`
- Components: `SongListSkeleton`, `TableSkeleton`, `CardGridSkeleton`
- Used throughout the app for better loading states

### Empty States
- **Component**: `/components/shared/EmptyState.tsx`
- Consistent empty state design across pages
- Optional call-to-action button

### UI Improvements
- Updated PlayerBar with visualizer, equalizer, and lyrics toggles
- Better navigation with Upload and Statistics links
- Improved error handling and user feedback

## Technical Details

### Web Audio API Integration
The visualizer and equalizer use the Web Audio API:
- `AudioContext`: Main audio processing context
- `AnalyserNode`: Frequency data extraction for visualizer
- `BiquadFilterNode`: EQ band filtering
- `MediaElementSource`: Connect HTML audio element to Web Audio API

### File Upload
Files are stored locally in `/public/uploads/`:
- Audio files: `/public/uploads/audio/`
- Cover images: `/public/uploads/covers/`
- Filenames include timestamp to prevent collisions

### Database Schema Updates
```prisma
model Song {
  // ... existing fields
  lyrics           String?
  playCount        Int                @default(0)
  listeningHistory ListeningHistory[]
}

model User {
  // ... existing fields
  listeningHistory ListeningHistory[]
}

model ListeningHistory {
  id        String   @id @default(cuid())
  userId    String
  songId    String
  playedAt  DateTime @default(now())
  user      User     @relation(...)
  song      Song     @relation(...)
  
  @@index([userId, playedAt])
}
```

## Future Enhancements

Potential improvements:
1. **Synced Lyrics**: LRC format support for time-synced lyrics
2. **Cloud Storage**: AWS S3 or similar for file storage
3. **Audio Processing**: Server-side metadata extraction
4. **Advanced Analytics**: More detailed statistics and insights
5. **Crossfade**: Smooth transitions between songs
6. **Playlist Sharing**: Public/private playlist sharing
7. **Social Features**: Follow users, activity feed
8. **Mobile Responsive**: Optimize for mobile devices
