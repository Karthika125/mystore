import { razorpay } from '@/lib/razorpay';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return new NextResponse('No items in cart', { status: 400 });
    }

    // Calculate total amount
    const amount = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    return new NextResponse('Error creating order', { status: 500 });
  }
} 