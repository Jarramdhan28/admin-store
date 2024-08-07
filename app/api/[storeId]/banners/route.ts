import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: Request, {params}: {params: {storeId: string}}){
    try {
        const {userId} = auth()
        const body = await req.json()
        const {label, imageUrl} = body

        if (!userId){
            return new  NextResponse("Unautorized", {status: 401})
        }

        if (!label){
            return new  NextResponse("Nama Banner Perlu Dimasukan", {status: 400})
        }

        if (!imageUrl){
            return new  NextResponse("Image Banner Perlu Dimasukan", {status: 400})
        }

        if(!params.storeId){
            return new NextResponse("Store id url dibutuhkan")
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

        const banner = await db.banner.create({
            data:{
                label,
                imageUrl,
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner)

    } catch (error) {
        console.log("[BANNNER_POST]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function GET(req: Request, {params}: {params: {storeId: string}}){
    try {
        if(!params.storeId){
            return new NextResponse("Store id url dibutuhkan")
        }

        const banner = await db.banner.findMany({
            where:{
                storeId: params.storeId
            }
        })

        return NextResponse.json(banner)

    } catch (error) {
        console.log("[BANNER_GET]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}