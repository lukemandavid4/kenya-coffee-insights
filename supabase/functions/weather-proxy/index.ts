const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENWEATHER_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { endpoint, lat, lon } = await req.json();

    if (!endpoint || lat === undefined || lon === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: endpoint, lat, lon" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let url: string;
    if (endpoint === "current") {
      url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`;
    } else if (endpoint === "forecast") {
      url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid endpoint. Use 'current' or 'forecast'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `WeatherAPI error [${response.status}]: ${JSON.stringify(data)}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
