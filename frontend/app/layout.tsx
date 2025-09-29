import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import '../main.css'

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex'
})

export const metadata: Metadata = {
  title: 'Briefly - Learn from the best in the industry',
  description: 'Follow the technical blogs of various companies and stay informed on engineering practices at scale.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${ibmPlexSans.variable} font-sans`}>
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  )
}
