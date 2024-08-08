import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: Request, {params}: {params: {storeId: string}}){
    try {
        const {userId} = auth()
        const body = await req.json()

        const {name, bannerId} = body

        if (!userId){
            return new  NextResponse("Unautorized", {status: 401})
        }

        if (!name){
            return new  NextResponse("Nama Category Perlu Dimasukan", {status: 400})
        }

        if (!bannerId){
            return new  NextResponse("Banner ID Perlu Dimasukan", {status: 400})
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

        const category = await db.category.create({
            data:{
                name,
                bannerId,
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORIS_POST]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function GET(req: Request, {params}: {params: {storeId: string}}){
    try {
        if(!params.storeId){
            return new NextResponse("Store id url dibutuhkan")
        }

        const category = await db.category.findMany({
            where:{
                storeId: params.storeId
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log("[CATEGORIS_GET]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}