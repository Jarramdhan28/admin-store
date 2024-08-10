"use client"
import Heading from "@/components/heading";
import { ImageUpload } from "@/components/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Product } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ProductFormProps{
    initialData: Product & {images: Image[]} | null
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm: React.FC<ProductFormProps> = ({initialData, categories}) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit product" : "Buat product"
    const description = initialData ? "Edit product toko" : "Buat product toko"
    const toasMessage = initialData ? "product berhasil di edit" : "product berhasil di buat"
    const action = initialData ? "Simpan" : "Buat product"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price))
        }: {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            isFeatured: false,
            isArchived: false
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)

            if (initialData){
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product berhasil di hapus")
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
                    <FormField control={form.control} name="images" render={({field}) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    disabled={loading} 
                                    onChange={(url) => field.onChange([...field.value, {url}])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    value={field.value.map((image) => image.url)}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nama product toko" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="price" render={({field}) => (
                            <FormItem>
                                <FormLabel>Harga</FormLabel>
                                <FormControl>
                                    <Input placeholder="Rp." disabled={loading} {...field} type="number"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="categoryId" render={({field}) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <FormControl>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Pilih Category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="isFeatured" render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Featured
                                    </FormLabel>
                                    <FormDescription>
                                        Produk ini akan muncul di homepage
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="isArchived" render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Archived
                                    </FormLabel>
                                    <FormDescription>
                                        Produk ini akan disembunyikan pada toko
                                    </FormDescription>
                                </div>
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
 
export default ProductForm;