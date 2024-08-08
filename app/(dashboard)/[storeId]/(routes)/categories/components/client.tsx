"use client"

import Heading from "@/components/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import ApiList from "@/components/ui/api-list"

interface CategoryClientProps{
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({data}) => {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Category (${data.length})`} description="Atur category untuk toko"/>
                <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
                    <Plus className="mr-4 h-4 w-4"/>
                    Tambah Category
                </Button>
            </div>
            <Separator/>

            <DataTable data={data} columns={columns} searchKey="name"/>

            <Heading title="API" description="Api untuk categories"/>
            <Separator/>
            <ApiList namaIndikator="categories" idIndikator="categoryId"/>
        </>
    )
}