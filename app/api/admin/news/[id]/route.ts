import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { getToken } = auth()
    // const token = await getToken()

    const response = await fetch(
      `${API_BASE_URL}/web/api/v1/adminapp/GetPostDetails?postId=${params.id}`,
      {
        headers: {
          // 'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch news details')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching news details:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { getToken } = auth()
    // const token = await getToken()
    const body = await request.json()

    const response = await fetch(
      `${API_BASE_URL}/web/api/v1/adminapp/UpdatePost`,
      {
        method: 'POST',
        headers: {
          // 'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: params.id,
          ...body,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update news')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating news:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { getToken } = auth()
    // const token = await getToken()

    const response = await fetch(
      `${API_BASE_URL}/web/api/v1/adminapp/DelPost`,
      {
        method: 'POST',
        headers: {
          // 'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: params.id,
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete news')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error deleting news:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
