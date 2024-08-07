"use client"

import { Banner } from "@prisma/client"
import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

interface BannerClientProps{
    data: Banner[]
}

export const BannerClient: React.FC<BannerClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Banner (${data.length})`} description="Atur benner untuk toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
                    <Plus className="mr-4 h-4 w-4"/>
                    Tambah Banner
                </Button>
            </div>
            <Separator/>
        </>
    )
}