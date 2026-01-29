import React from "react"
import type { Metadata, Viewport } from 'next' // Import Viewport
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// 1. Configure fonts with variables so Tailwind can use them
const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

// 2. VIEWPORT: Handles appearance on mobile devices (theme color, scaling)
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents zooming on input focus on iOS
}

// 3. METADATA: Handles SEO and Social Sharing
export const metadata: Metadata = {
  // Use a template so sub-pages can have titles like "Settings | NoteHub"
  title: {
    default: 'NoteHub - Smart Sticky Notes',
    template: '%s | NoteHub',
  },
  description: 'Create, organize, and manage your thoughts with smart sticky notes. Search, filter, and pin your most important notes.',
  applicationName: 'NoteHub',
  authors: [{ name: 'Robiul Hasan Jisan', url: 'https://robiul_hasan_jisan.com' }],
  keywords: ['sticky notes', 'productivity', 'note taking', 'react', 'nextjs', 'organization'],
  creator: 'Robiul Hasan Jisan',
  publisher: 'NoteHub',
  

  metadataBase: new URL('https://notehub.vercel.app'), 

  // Open Graph = How it looks on Facebook, LinkedIn, Discord
  openGraph: {
    title: 'NoteHub - Smart Sticky Notes',
    description: 'The smartest way to manage your thoughts.',
    url: 'https://notehub.vercel.app',
    siteName: 'NoteHub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoteHub Preview',
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub - Smart Sticky Notes',
    description: 'Create, organize, and manage your thoughts with smart sticky notes.',
    creator: '@yourtwitterhandle',
    images: ['/og-image.png'], 
  },

  // Icons
  icons: {
    icon: '/loggo.png',
    shortcut: '/loggo.png',
    apple: '/apple-icon.png', 
  },

  // Robot crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Apply the font variables here so they can be used in Tailwind 
         as font-sans and font-mono 
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}