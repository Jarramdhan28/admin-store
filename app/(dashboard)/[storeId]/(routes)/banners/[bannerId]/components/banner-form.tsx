"use client"
import Heading from "@/components/heading";
import { ImageUpload } from "@/components/image-upload";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banner } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface BannerFormProps{
    initialData: Banner | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type BannerFormValues = z.infer<typeof formSchema>

const BannerForm: React.FC<BannerFormProps> = ({initialData}) => {
    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Banner" : "Buat Banner"
    const description = initialData ? "Edit banner toko" : "Buat banner toko"
    const toasMessage = initialData ? "Banner berhasil di edit" : "Banner berhasil di buat"
    const action = initialData ? "Simpan" : "Buat banner"

    const form = useForm<BannerFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BannerFormValues) => {
        try {
            setLoading(true)

            if (initialData){
                await axios.patch(`/api/${params.storeId}/banners/${params.bannerId}`, data)
            }else{
                await axios.post(`/api/${params.storeId}/banners`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/banners`)
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
            await axios.delete(`/api/${params.storeId}/banners/${params.bannerId}`)
            router.refresh()
            router.push("/")
            toast.success("Banner berhasil di hapus")
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
                        <FormField control={form.control} name="label" render={({field}) => (
                            <FormItem>
                                <FormLabel>Label </FormLabel>
                                <FormControl>
                                    <Input placeholder="Label benner toko" disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        <FormField control={form.control} name="imageUrl" render={({field}) => (
                            <FormItem>
                                <FormLabel>Image Url</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        disabled={loading} 
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                        value={field.value ? [field.value] : []}/>
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
 
export default BannerForm;