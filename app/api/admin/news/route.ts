import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET() {
  try {
    // const { getToken } = auth()
    // const token = await getToken()

    const response = await fetch(`${API_BASE_URL}/web/api/v1/adminapp/GetPost`, {
      headers: {
        // 'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching news:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // const { getToken } = auth()
    // const token = await getToken()
    const formData = await request.formData()

    const response = await fetch(`${API_BASE_URL}/web/api/v1/adminapp/CreatePost`, {
      method: 'POST',
      headers: {
        // 'Authorization': `token ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to create news')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating news:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
