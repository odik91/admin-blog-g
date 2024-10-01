import { useAppDispatch, useAppSelector } from "@/hooks/userCustomHook";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { createCategory } from "@/features/category/categorySlice";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(3, { message: "Please insert category" }),
  description: z.string(),
});

const AddCategoryModal = () => {
  const [open, setOpen] = useState(false);
  const { is_loading } = useAppSelector((store) => store.category);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient()

  // define form for zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(createCategory({ ...values })).then(() => {
      setOpen(false);
      form.reset()
      queryClient.invalidateQueries();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-center">Add Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <DialogDescription>
                <span className="text-red-500">(*)</span> Required field
              </DialogDescription>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-3 items-center gap-1">
                    <FormLabel>
                      <span className="text-red-500">*</span>Category
                    </FormLabel>
                    <FormControl className="col-span-2">
                      <Input placeholder="enter category name" {...field} />
                    </FormControl>
                    <div></div>
                    <FormMessage className="col-span-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) =>  (
                  <FormItem className="grid grid-cols-3 items-center gap-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl className="col-span-2">
                      <Textarea placeholder="enter description" {...field} />
                    </FormControl>
                    <div></div>
                    <FormMessage className="col-span-2" />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center mt-3">
                <Button type="submit" className="w-full">
                  {is_loading ? "Please wait..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddCategoryModal;
