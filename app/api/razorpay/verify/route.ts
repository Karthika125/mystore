import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    const isAuthentic = signature === razorpay_signature;

    if (!isAuthentic) {
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // Here you can save the order details to your database
    // await saveOrder({ orderId: razorpay_order_id, paymentId: razorpay_payment_id });

    return NextResponse.json({
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new NextResponse('Error verifying payment', { status: 500 });
  }
} 