import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_DATABASE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    // Debug: Check if environment variables are set
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_DATABASE_URL ? 'Set' : 'Missing')
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_DATABASE_KEY ? 'Set' : 'Missing')
    
    const { data, error } = await supabase
      .from('article_summaries')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Query result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json({ 
        error: 'Failed to fetch blogs', 
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}
