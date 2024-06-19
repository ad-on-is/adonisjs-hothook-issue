import { getMe } from '@/db/getMe'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/payment',
]

const authRoutes = [
    '/',
    '/post/:id',
    '/payment',
]



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const { user, errors } = await getMe();

    if (!user) {

        if (publicRoutes.includes(request.nextUrl.pathname)) {
            return NextResponse.next()
        }

        return NextResponse.redirect(new URL('/auth/login/', request.url))
    }

    if (authRoutes.map(route => request.nextUrl.pathname.startsWith(route)).some(Boolean)) {
        return NextResponse.next()
    }



    return NextResponse.redirect(new URL('/', request.url))
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        }
    ],
}