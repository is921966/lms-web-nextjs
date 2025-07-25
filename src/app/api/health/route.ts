import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'lms-web',
    version: process.env.npm_package_version || '0.1.0'
  })
} 