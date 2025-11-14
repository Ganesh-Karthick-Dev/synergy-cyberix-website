import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route Handler for Google OAuth Callback
 * This proxies the callback to the backend server and handles the redirect
 */
export async function GET(request: NextRequest) {
  console.log('🔵 [Website Callback] Google OAuth callback received');
  console.log('🔵 [Website Callback] Request URL:', request.url);
  console.log('🔵 [Website Callback] Request headers:', {
    cookie: request.headers.get('cookie') ? 'Present' : 'Missing',
    userAgent: request.headers.get('user-agent'),
  });

  try {
    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';
    console.log('🔵 [Website Callback] Backend URL:', backendUrl);
    
    // Get all query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    console.log('🔵 [Website Callback] Query params:', {
      code: searchParams.get('code') ? 'Present' : 'Missing',
      scope: searchParams.get('scope'),
      authuser: searchParams.get('authuser'),
      prompt: searchParams.get('prompt'),
      fullQueryString: queryString,
    });
    
    // Build backend callback URL with all query params
    const backendCallbackUrl = `${backendUrl}/api/auth/google/callback${queryString ? `?${queryString}` : ''}`;
    console.log('🔵 [Website Callback] Calling backend:', backendCallbackUrl);
    
    // Forward the request to the backend using fetch
    // Note: credentials must be 'include' to send/receive cookies
    const response = await fetch(backendCallbackUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      redirect: 'manual', // Don't follow redirects automatically
      credentials: 'include', // Include cookies in request
    });
    
    console.log('🔵 [Website Callback] Backend response status:', response.status);
    
    // Get all headers - including Set-Cookie
    const allHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log('🔵 [Website Callback] All backend response headers:', Object.keys(allHeaders));
    console.log('🔵 [Website Callback] Backend response headers:', {
      location: response.headers.get('location'),
      'set-cookie': response.headers.get('set-cookie') ? 'Present' : 'Missing',
      contentType: response.headers.get('content-type'),
    });
    
    // If backend redirects, get the redirect location
    if (response.status >= 300 && response.status < 400) {
      let location = response.headers.get('location');
      console.log('🔵 [Website Callback] Backend redirect location:', location);
      
      // Fix redirect URL: if backend redirects to port 3000 (admin), change it to 4006 (website)
      if (location) {
        // Replace localhost:3000 with localhost:4006 (handle both http and https)
        location = location.replace(/https?:\/\/localhost:3000/gi, 'http://localhost:4006');
        // Also handle if it redirects to /signin (admin route) - change to /login (website route)
        location = location.replace(/\/signin(\?|$)/g, '/login$1');
        // Also replace any other port 3000 or 3001 references (in case of different protocols)
        location = location.replace(/:3000\//g, ':4006/');
        location = location.replace(/:3000$/g, ':4006');
        location = location.replace(/:3001\//g, ':4006/');
        location = location.replace(/:3001$/g, ':4006');
        console.log('🔵 [Website Callback] Fixed redirect location:', location);
      }
      
      if (location) {
        // Backend has set cookies in Set-Cookie header
        // We need to extract and forward them to the browser
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('🔵 [Website Callback] Raw Set-Cookie header:', setCookieHeader);
        
        // Create redirect response - use fixed location directly
        // Always use the fixed location as the redirect URL
        // If location is already a full URL, use it; otherwise construct from website origin
        let redirectUrl: URL;
        if (location.startsWith('http://') || location.startsWith('https://')) {
          redirectUrl = new URL(location);
          // CRITICAL: Always force port 4006 for website (not admin port 3000)
          if (redirectUrl.hostname === 'localhost') {
            redirectUrl.port = '4006';
            redirectUrl.protocol = 'http:';
          }
        } else {
          // Relative URL - construct using website origin (port 4006)
          const websiteOrigin = `${request.nextUrl.protocol}//${request.nextUrl.hostname}:4006`;
          redirectUrl = new URL(location, websiteOrigin);
        }

        // Final safety check: ensure we're redirecting to port 4006, not 3000 or 3001
        if (redirectUrl.hostname === 'localhost' && redirectUrl.port !== '4006') {
          console.warn('🔵 [Website Callback] ⚠️ Port mismatch detected, forcing port 4006');
          redirectUrl.port = '4006';
        }

        console.log('🔵 [Website Callback] Final redirect URL:', redirectUrl.toString());
        const redirectResponse = NextResponse.redirect(redirectUrl);

        // After successful authentication, try to fetch user data and set readable cookies
        try {
          console.log('🔵 [Website Callback] Attempting to fetch user profile data...');
          const profileResponse = await fetch(`${backendUrl}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userData = profileData?.data;

            if (userData) {
              console.log('🔵 [Website Callback] Setting user info cookies:', {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
              });

              // Set readable cookies for client-side access
              const cookieOptions = {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/',
              };

              if (userData.email) {
                redirectResponse.cookies.set('userEmail', userData.email, cookieOptions);
              }

              if (userData.firstName || userData.lastName) {
                const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email?.split('@')[0] || 'User';
                redirectResponse.cookies.set('userName', fullName, cookieOptions);
              }
            }
          } else {
            console.warn('🔵 [Website Callback] Could not fetch user profile data:', profileResponse.status);
          }
        } catch (profileError) {
          console.error('🔵 [Website Callback] Error fetching user profile:', profileError);
          // Don't fail the authentication if profile fetch fails
        }
        
        // Forward Set-Cookie headers to the browser
        if (setCookieHeader) {
          // Parse and set cookies
          // Cookies are typically separated by ", " but cookie values can contain commas
          // We'll use a simple approach: split by ", " and parse each
          const cookies = setCookieHeader.split(/,\s*(?=[^;]+\=)/);
          
          cookies.forEach((cookieString) => {
            const trimmed = cookieString.trim();
            // Parse cookie: name=value; attribute1=value1; attribute2
            const nameValueMatch = trimmed.match(/^([^=]+)=([^;,]+)/);
            
            if (nameValueMatch) {
              const name = nameValueMatch[1].trim();
              const value = nameValueMatch[2].trim();
              
              if (name && value) {
                // Parse cookie options
                const cookieOptions: any = {
                  httpOnly: trimmed.includes('HttpOnly'),
                  secure: trimmed.includes('Secure'),
                  sameSite: trimmed.includes('SameSite=None') ? 'none' : 
                           trimmed.includes('SameSite=Strict') ? 'strict' : 
                           trimmed.includes('SameSite=Lax') ? 'lax' : 'lax',
                  path: '/',
                };
                
                // Extract Max-Age or Expires
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
                  console.log(`🔵 [Website Callback] ✅ Set cookie: ${name}`, {
                    valueLength: value.length,
                    httpOnly: cookieOptions.httpOnly,
                    secure: cookieOptions.secure,
                    sameSite: cookieOptions.sameSite,
                    maxAge: cookieOptions.maxAge,
                  });
                } catch (cookieError: any) {
                  console.error(`🔵 [Website Callback] ❌ Failed to set cookie ${name}:`, cookieError.message);
                }
              }
            }
          });
        }
        
        console.log('🔵 [Website Callback] Redirecting to:', location);
        return redirectResponse;
      }
    }
    
    // If there's an error, redirect to login with error
    if (response.status >= 400) {
      const responseText = await response.text();
      console.error('🔵 [Website Callback] Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('🔵 [Website Callback] Failed to parse error response as JSON');
      }
      
      const errorMessage = (errorData as any)?.error?.message || 'Authentication failed';
      console.error('🔵 [Website Callback] Redirecting to login with error:', errorMessage);
      
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }
    
    // If successful but no redirect, redirect to home (website)
    console.log('🔵 [Website Callback] No redirect from backend, redirecting to home');
    const websiteUrl = new URL('/', request.url);
    websiteUrl.hostname = 'localhost';
    websiteUrl.port = '4006';
    return NextResponse.redirect(websiteUrl);
  } catch (error: any) {
    console.error('🔵 [Website Callback] Error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || 'Authentication failed')}`, request.url)
    );
  }
}

