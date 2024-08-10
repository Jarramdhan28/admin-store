"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import ApiList from "@/components/ui/api-list"

interface ProductClientProps{
    data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Product (${data.length})`} description="Atur product untuk toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-4 h-4 w-4"/>
                    Tambah Product
                </Button>
            </div>
            <Separator/>

            <DataTable data={data} columns={columns} searchKey="name"/>

            <Heading title="API" description="Api untuk Product"/>
            <Separator/>
            <ApiList namaIndikator="products" idIndikator="productId"/>
        </>
    )
}