import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { filename, contentType } = await request.json()
    
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
    }

    // Create Supabase client with service role
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    // Generate unique filename
    const timestamp = Date.now()
    const uniqueFilename = `${session.user.id}/${timestamp}-${filename}`

    // Get signed URL for upload
    const { data, error } = await supabase
      .storage
      .from('review-photos')
      .createSignedUploadUrl(uniqueFilename)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: uniqueFilename,
      publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/review-photos/${uniqueFilename}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
