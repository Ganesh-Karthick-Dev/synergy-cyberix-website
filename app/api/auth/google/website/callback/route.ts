import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route Handler for Website Google OAuth Callback
 * This proxies to the backend website-specific callback endpoint
 */
export async function GET(request: NextRequest) {
  console.log('🌐 [Website Callback] Google OAuth callback received for website');
  console.log('🌐 [Website Callback] Request URL:', request.url);

  try {
    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
    
    // Get all query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Build backend website callback URL with all query params
    const backendCallbackUrl = `${backendUrl}/api/auth/google/website/callback${queryString ? `?${queryString}` : ''}`;
    console.log('🌐 [Website Callback] Calling backend:', backendCallbackUrl);
    
    // Forward the request to the backend using fetch
    const response = await fetch(backendCallbackUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      redirect: 'manual', // Don't follow redirects automatically
      credentials: 'include', // Include cookies in request
    });
    
    console.log('🌐 [Website Callback] Backend response status:', response.status);
    
    // If backend redirects, get the redirect location
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log('🌐 [Website Callback] Backend redirect location:', location);
      
      if (location) {
        // Backend has set cookies in Set-Cookie header
        const setCookieHeader = response.headers.get('set-cookie');
        
        // Create redirect response
        const redirectUrl = new URL(location);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        // Forward Set-Cookie headers to the browser
        if (setCookieHeader) {
          const cookies = setCookieHeader.split(/,\s*(?=[^;]+\=)/);
          
          cookies.forEach((cookieString) => {
            const trimmed = cookieString.trim();
            const nameValueMatch = trimmed.match(/^([^=]+)=([^;,]+)/);
            
            if (nameValueMatch) {
              const name = nameValueMatch[1].trim();
              const value = nameValueMatch[2].trim();
              
              if (name && value) {
                const cookieOptions: any = {
                  httpOnly: trimmed.includes('HttpOnly'),
                  secure: trimmed.includes('Secure'),
                  sameSite: trimmed.includes('SameSite=None') ? 'none' : 
                           trimmed.includes('SameSite=Strict') ? 'strict' : 
                           trimmed.includes('SameSite=Lax') ? 'lax' : 'lax',
                  path: '/',
                };
                
                const maxAgeMatch = trimmed.match(/Max-Age=(\d+)/);
                const expiresMatch = trimmed.match(/Expires=([^;,]+)/);
                
                if (maxAgeMatch) {
                  cookieOptions.maxAge = parseInt(maxAgeMatch[1]);
                } else if (expiresMatch) {
                  const expiresDate = new Date(expiresMatch[1].trim());
                  const now = new Date();
                  cookieOptions.maxAge = Math.max(0, Math.floor((expiresDate.getTime() - now.getTime()) / 1000));
                }
                
                try {
                  redirectResponse.cookies.set(name, value, cookieOptions);
                  console.log(`🌐 [Website Callback] ✅ Set cookie: ${name}`);
                } catch (cookieError: any) {
                  console.error(`🌐 [Website Callback] ❌ Failed to set cookie ${name}:`, cookieError.message);
                }
              }
            }
          });
        }
        
        console.log('🌐 [Website Callback] Redirecting to:', location);
        return redirectResponse;
      }
    }
    
    // If there's an error, redirect to login with error
    if (response.status >= 400) {
      const responseText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        // Ignore parse error
      }
      
      const errorMessage = (errorData as any)?.error?.message || 'Authentication failed';
      console.error('🌐 [Website Callback] Redirecting to login with error:', errorMessage);
      
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }
    
    // If successful but no redirect, redirect to home
    console.log('🌐 [Website Callback] No redirect from backend, redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: any) {
    console.error('🌐 [Website Callback] Error:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || 'Authentication failed')}`, request.url)
    );
  }
}

