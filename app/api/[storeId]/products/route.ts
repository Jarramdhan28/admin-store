import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: Request, {params}: {params: {storeId: string}}){
    try {
        const {userId} = auth()
        const body = await req.json()
        const {
            name, 
            price,
            categoryId,
            images,
            isFeatured,
            isArchived
        } = body

        if (!userId){
            return new  NextResponse("Unautorized", {status: 401})
        }

        if (!name){
            return new  NextResponse("Nama Product Perlu Dimasukan", {status: 400})
        }
        
        if (!images || !images.length){
            return new  NextResponse("Image Perlu Dimasukan", {status: 400})
        }

        if (!price){
            return new  NextResponse("Price Product Perlu Dimasukan", {status: 400})
        }

        if (!categoryId){
            return new  NextResponse("Category Product Perlu Dimasukan", {status: 400})
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

        const product = await db.product.create({
            data:{
                name, 
                price,
                categoryId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
                images:{
                    createMany:{
                        data: [...images.map((image: { url:string }) => image)]    
                    }
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_POST]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function GET(req: Request, {params}: {params: {storeId: string}}){
    try {
        const {searchParams} = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const isFeatured = searchParams.get("isFeatured")

        if(!params.storeId){
            return new NextResponse("Store id url dibutuhkan")
        }

        const product = await db.product.findMany({
            where:{
                storeId: params.storeId,
                categoryId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log("[PRODUCT_GET]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}