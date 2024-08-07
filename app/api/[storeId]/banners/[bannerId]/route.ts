import db from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import {  NextResponse } from "next/server"

export async function GET(
    req: Request,
    {params}: {params: {bannerId: string}}
){
    try {
        if(!params.bannerId){
            return new NextResponse("banner ID dibutuhkan", {status: 400})
        }

        const banner = await db.banner.findUnique({
            where:{
                id: params.bannerId,
            },
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.log('[STORE_GET]', error)

        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    {params}: {params: {storeId: string, bannerId: string}}
){
    try {
        const {userId} = auth()
        const body = await req.json()

        const {label, imageUrl} = body

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label){
            return new NextResponse("Masukan label toko terlebih dahulu", {status: 400})
        }

        if(!imageUrl){
            return new NextResponse("Masukan iamage url toko terlebih dahulu", {status: 400})
        }
        
        if(!params.bannerId){
            return new NextResponse("Banner ID dibutuhkan", {status: 400})
        }

        const storeByUserid = await db.store.findFirst({
            where:{
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserid){
            return new NextResponse("unauthorized", {status: 401})
        }

        const banner = await db.banner.updateMany({
            where:{
                id: params.bannerId,
            }, data:{
                label, 
                imageUrl
            }
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.log('[BANNER_PATCH]', error)

        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string, bannerId: string}}
){
    try {
        const {userId} = auth()

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }
        
        if(!params.bannerId){
            return new NextResponse("banner ID dibutuhkan", {status: 400})
        }

        const storeByUserid = await db.store.findFirst({
            where:{
                id: params.storeId,
                userId: userId
            }
        })

        if(!storeByUserid){
            return new NextResponse("unauthorized", {status: 401})
        }

        const banner = await db.banner.deleteMany({
            where:{
                id: params.bannerId,
            },
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.log('[STORE_DELETE]', error)

        return new NextResponse("Internal Error", {status: 500})
    }
}