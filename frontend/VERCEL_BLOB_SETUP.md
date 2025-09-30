# Vercel Blob Storage Setup

This project uses Vercel Blob storage to serve random images for blog posts.

## Environment Variables

Add the following environment variable to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## How to get your Vercel Blob token:

1. Go to your Vercel dashboard
2. Navigate to your project settings
3. Go to the "Storage" tab
4. Create a new Blob store or use an existing one
5. Copy the `BLOB_READ_WRITE_TOKEN` from the environment variables section

## Features

- **Random Image Assignment**: Each blog post gets a random image from your Vercel blob storage
- **Automatic Fallback**: If no images are available, a placeholder is shown
- **Responsive Design**: Images are properly sized and cropped for both desktop and mobile views
- **Hover Effects**: Images have subtle hover animations on the blog listing page

## API Endpoints

- `GET /api/images?count=N` - Returns N random images from blob storage

## Usage

The images are automatically fetched and assigned when:
- Loading the main blog listing page
- Viewing individual blog posts

No additional configuration is needed once the environment variable is set.
