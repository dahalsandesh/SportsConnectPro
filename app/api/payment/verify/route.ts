import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pidx, transaction_id, amount, status, purchase_order_id } = body;

    // TODO: Verify the payment with Khalti API using the pidx
    // This is a placeholder - you'll need to implement the actual Khalti verification
    
    // For now, we'll just log the data and return success
    console.log('Payment verification data:', {
      pidx,
      transaction_id,
      amount,
      status,
      purchase_order_id,
      verifiedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        pidx,
        transaction_id,
        amount,
        status,
        purchase_order_id,
        verified: true,
        verifiedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
