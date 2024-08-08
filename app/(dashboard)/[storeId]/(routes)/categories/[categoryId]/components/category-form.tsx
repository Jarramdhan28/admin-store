"use client"

import axios from "axios";
import Heading from "@/components/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface CategoryFormProps {
  initialData: Category | null;
  banners: Banner[];
}

const formSchema = z.object({
    name: z.string().min(1),
    bannerId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm: React.FC<CategoryFormProps> = ({initialData, banners}) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Category" : "Buat Category"
    const description = initialData ? "Edit Category toko" : "Buat Category toko"
    const toasMessage = initialData ? "Category berhasil di edit" : "Category berhasil di buat"
    const action = initialData ? "Simpan Category" : "Buat Category"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            bannerId: ''
        },
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)

            if (initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success(toasMessage)
        } catch (error) {
            toast.error("Cek data kembali yang dimasukan")
        }finally{
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category berhasil di hapus")
        } catch (error) {
            toast.error("Cek Kembali data tokonya")
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }

    return ( 
        <> 
            <AlertModal 
                isOpen={open} 
                onClose={() => setOpen(false)} 
                onConfirm={onDelete} 
                loading={loading}/>

            <div className="flex items-center justify-between">
                <Heading title={title} description={description}/>
                {initialData && (
                    <Button disabled={loading} variant={"destructive"} size={"sm"} onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4"/>
                    </Button>
                )}
            </div>
            <Separator/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Nama </FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama category" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="bannerId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Banner</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Pilih Banner"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {banners.map((banner) => (
                                                <SelectItem key={banner.id} value={banner.id}>
                                                    {banner.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    </div>
                    <Button disabled={loading} type="submit">
                        {action}
                    </Button>
                </form>
            </Form>

            <Separator/>
        </>
     );
}
 
export default CategoryForm;