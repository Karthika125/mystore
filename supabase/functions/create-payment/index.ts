
// This file is meant to be deployed as a Supabase Edge Function
// It will be processed by Supabase deployments, not by the TypeScript compiler in the frontend
// We'll use specialized comments to avoid TypeScript errors

// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import Stripe from "https://esm.sh/stripe@14.21.0";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication.
  const supabaseClient = createClient(
    "https://nzwwcituvkxkqvbiavcq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56d3djaXR1dmt4a3F2YmlhdmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTA2MTMsImV4cCI6MjA2MDI2NjYxM30.EXcog9_4GQ-cJVL8XbiJpBiAI2Uy-5hQ-yeMiZhdfgM"
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    // Read the request body
    const { amount, items } = await req.json();
    
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Initialize Stripe with a dummy key (replace this with actual key)
    // @ts-ignore
    const stripe = new Stripe("sk_test_YOUR_STRIPE_KEY", {
      apiVersion: "2023-10-16",
    });
    
    // For demonstration purposes, return a mock payment session URL
    const sessionUrl = `https://checkout.stripe.com/c/pay/mock-session-${Date.now()}`;

    // Create an order in the database if user is authenticated
    if (user) {
      // Create a service client with admin privileges
      const supabaseAdmin = createClient(
        "https://nzwwcituvkxkqvbiavcq.supabase.co",
        // @ts-ignore
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        { auth: { persistSession: false } }
      );
      
      // Create order record
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: user.id,
          total: amount,
          status: "pending",
        })
        .select()
        .single();
        
      if (orderError) {
        throw orderError;
      }
      
      // Add order items
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.id || "unknown",
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        }));
        
        await supabaseAdmin.from("order_items").insert(orderItems);
      }
    }

    return new Response(JSON.stringify({ url: sessionUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
