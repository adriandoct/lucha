import { NextResponse } from "next/server";

const PLANS = [
  { id: "0", title: "Mensualidad Regular - Raion Kay", price: 500 },
  { id: "1", title: "Trimestre Raion Kay - Raion Kay", price: 1400 },
  { id: "2", title: "Semestre Shito-Ryu - Raion Kay", price: 2700 },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planIndex = searchParams.get("plan") || "0";
    
    // Find the selected plan, fallback to index 0 if out of range
    const plan = PLANS.find(p => p.id === planIndex) || PLANS[0];
    
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const isMockToken = !token || 
                        token === "tu_access_token_aqui" || 
                        token.trim() === "" ||
                        token.includes("MOCK") ||
                        token.includes("TEST");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (isMockToken) {
      console.log("Mercado Pago token not configured or using mock, redirecting to local checkout simulator.");
      return NextResponse.redirect(new URL(`/checkout/mock?plan=${plan.id}`, request.url));
    }

    // Call Mercado Pago Preferences API
    const response = await fetch("https://api.mercadopago.com/v1/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: plan.id,
            title: plan.title,
            quantity: 1,
            unit_price: plan.price,
            currency_id: "MXN",
          }
        ],
        back_urls: {
          success: `${appUrl}/register?payment=success&plan=${plan.id}`,
          failure: `${appUrl}/register?payment=failure`,
          pending: `${appUrl}/register?payment=pending`,
        },
        auto_return: "approved",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mercado Pago API error response:", errorText);
      // Fallback to mock checkout if API call fails
      return NextResponse.redirect(new URL(`/checkout/mock?plan=${plan.id}&api_error=true`, request.url));
    }

    const data = await response.json();
    
    // Mercado Pago provides 'init_point' for live/redirect checkout, and 'sandbox_init_point' for testing
    // We will use 'init_point' as it is standard and dynamically routes based on sandbox/production token
    const checkoutUrl = data.init_point || data.sandbox_init_point;

    if (!checkoutUrl) {
      console.error("No init_point or sandbox_init_point found in response:", data);
      return NextResponse.redirect(new URL(`/checkout/mock?plan=${plan.id}&api_error=no_url`, request.url));
    }

    return NextResponse.redirect(checkoutUrl);
  } catch (error) {
    console.error("Unexpected error in checkout API route:", error);
    // Fallback redirect to register with error, or redirect to mock
    return NextResponse.redirect(new URL(`/checkout/mock?plan=0&api_error=exception`, request.url));
  }
}
