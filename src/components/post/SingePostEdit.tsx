import { useGetCategoriesNonFiltering } from "@/hooks/actions/category";
import { PostMainData, PostType } from "@/types/postType";
import { OptionType } from "@/types/subcategoryType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";
import InputImage from "./InputImage";
import InputText from "./InputText";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useGetSubcategoriesNonFiltering } from "@/hooks/actions/subcategory";
import { useUpdatePost } from "@/hooks/actions/post";
import Swal from "sweetalert2";

const formSchema = z.object({
  id: z.string().optional(),
  category_id: z
    .string({ required_error: "Plesae select a value" })
    .min(1, { message: "Please select category" }),
  subcategory_id: z
    .string({
      required_error: "Please select subcategory",
    })
    .min(1, { message: "Please select subcategory" }),
  title: z.string().min(5, { message: "Please insert post title" }).max(300, {
    message: "Title length should not be longer than 300 characters.",
  }),
  image: z
    .instanceof(FileList, { message: "Image is required" })
    .refine((files) => files, { message: "Image is required" })
    // .refine((files) => files.length > 0, { message: "Image is required" })
    .refine(
      (files) => files.length === 0 || files[0]?.size <= 3 * 1024 * 1024, // 3MB max size
      { message: "File must be less than 3MB" }
    )
    .refine(
      (files) => files.length === 0 || files[0]?.type.startsWith("image/"), // Check file type
      { message: "Only image files are allowed" }
    ),
  // .optional(),
  meta_description: z
    .string()
    .min(5, { message: "Please insert meta description" })
    .max(300, {
      message:
        "Meta description length should not be longer than 300 characters.",
    }),
  meta_keyword: z.string().min(3, { message: "Please insert meta keyword" }),
  seo_title: z.string().min(3, { message: "Please insert seo title" }),
  content: z.string().min(3, { message: "Please insert post content" }),
  // is_active: z.boolean().optional(),
  is_active: z.enum(["active", "inactive"]),
});

export type EditSinglePost = z.infer<typeof formSchema>;

const SingePostEdit = ({
  postData,
  edit,
  setEdit,
}: {
  postData: PostMainData;
  edit: boolean;
  setEdit: (status: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: postData.id,
      category_id: postData.category_id.toString(),
      subcategory_id: postData.subcategory_id,
      title: postData.title,
      image: undefined,
      meta_description: postData.meta_description,
      meta_keyword: postData.meta_keyword,
      seo_title: postData.seo_title,
      is_active: postData.is_active === 1 ? "active" : "inactive",
      content: postData.content,
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesNonFiltering();

  const filterCategories = (inputValue: string) => {
    return categories?.filter(
      (i: { value: number | string; label: string }) => {
        return i.label
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase());
      }
    );
  };

  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    setTimeout(() => {
      callback(filterCategories(inputValue || ""));
    }, 1000);
  };

  const { data: subcategories } = useGetSubcategoriesNonFiltering(
    form.watch("category_id")
  );

  const { mutateAsync: editPost, isPending: isEditPost } = useUpdatePost();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let data: PostType;
    const oldImage = postData.image.split("/");

    if (oldImage[oldImage.length - 1] === values.image[0].name) {
      data = { ...values, oldImage: values.image[0].name };
    } else {
      data = values
    }
    
    editPost(data).then((res) => {
      if (res?.post) {
        Swal.fire({
          title: "Success!",
          icon: "success",
          html: res?.message,
        });
        form.reset();
        setEdit(false)
      } else {
        Swal.fire({
          title: "Error!",
          icon: "error",
          html: res?.message,
        });
      }
    });
  };

  if (edit)
    return (
      <div className={`p-4 border rounded-md shadow-md my-3`}>
        <Card className="transform transition-all scale-100">
          <CardHeader className="bg-slate-50 p-3">
            <CardTitle className="text-center text-xl">Edit Post</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border p-3 rounded-md shadow-md">
                  <h1 className="font-semibold text-center">Section Title</h1>
                  <Separator className="my-3" />
                  {/* select category */}
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-1">
                        <FormLabel>
                          Category{" "}
                          <span className="text-red-500">*(Required)</span>
                        </FormLabel>
                        <FormControl className="col-span-2">
                          <AsyncSelect
                            className={
                              errors.category_id
                                ? "border border-red-500 rounded-sm"
                                : form.getValues("category_id")
                                ? "border border-green-500 rounded-sm"
                                : ""
                            }
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={categories}
                            onChange={(option: OptionType | null) => {
                              if (option) {
                                form.resetField("subcategory_id");
                                form.setValue("subcategory_id", "");
                                form.clearErrors("category_id");
                                return field.onChange(option.value.toString());
                              }
                            }}
                            placeholder={
                              postData.get_category.name || `Select Category`
                            }
                            isLoading={isCategoriesLoading}
                          />
                        </FormControl>
                        <div></div>
                        <FormMessage className="col-span-2" />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory Field */}
                  <FormField
                    control={form.control}
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-3 items-center gap-1">
                        <FormLabel>
                          Subcategory <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl className="col-span-2">
                          <Select
                            className={
                              errors.subcategory_id
                                ? "border border-red-500 rounded-sm"
                                : form.getValues("subcategory_id")
                                ? "border border-green-500 rounded-sm"
                                : ""
                            }
                            options={subcategories || []}
                            {...field}
                            value={
                              subcategories?.find(
                                (option: { value: string }) =>
                                  option.value === field.value
                              ) || null
                            } // Map the value to an OptionType object
                            onChange={(option: OptionType | null) => {
                              const subcategory_data = option?.value || "";
                              field.onChange(subcategory_data);
                              form.setValue("subcategory_id", subcategory_data);
                            }}
                          />
                        </FormControl>
                        <div></div>
                        <FormMessage className="col-span-2" />
                      </FormItem>
                    )}
                  />

                  {/* title */}
                  <InputText
                    inputName="title"
                    title="title"
                    placeholder="Enter post title"
                    minLength={5}
                    maxLength={300}
                    form={form}
                  />

                  {/* image */}
                  <InputImage
                    form={form}
                    fieldName="image"
                    maxSize={3}
                    title="Headline Image"
                    defaultFile={postData.image}
                  />
                </div>

                <div className="border p-3 rounded-md shadow-md mt-4">
                  <h1 className="font-semibold text-center">SEO Content</h1>
                  <Separator className="my-3" />
                  {/* meta_description */}
                  <InputText
                    inputName="meta_description"
                    title="Meta Description"
                    placeholder="Enter meta description"
                    minLength={5}
                    maxLength={300}
                    form={form}
                  />

                  {/* meta_keyword */}
                  <InputText
                    inputName="meta_keyword"
                    title="Meta Keywords"
                    placeholder="Enter a meta keyword (if more than one, sparate it with a ',' comma)."
                    minLength={5}
                    form={form}
                  />

                  {/* seo title */}
                  <InputText
                    inputName="seo_title"
                    title="SEO Title"
                    placeholder="Enter the SEO title"
                    minLength={5}
                    maxLength={300}
                    form={form}
                  />
                </div>

                <div className="border p-3 rounded-md shadow-md mt-4">
                  <label
                    htmlFor="content"
                    className="font-semibold text-center"
                  >
                    Content
                  </label>
                  <Separator className="my-3" />
                  <Editor
                    id="content"
                    apiKey={import.meta.env.VITE_EDITOR_API_KEY}
                    licenseKey={import.meta.env.VITE_EDITOR_LICENSE_KEY}
                    initialValue={postData.content}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "link",
                        "image",
                        "lists",
                        "charmap",
                        "preview",
                        "anchor",
                        "pagebreak",
                        "searchreplace",
                        "wordcount",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "emoticons",
                        "help",
                      ],
                      toolbar:
                        "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | link image | print preview media fullscreen | " +
                        "forecolor backcolor emoticons | help",
                    }}
                    onEditorChange={(content) => {
                      setValue("content", content);
                    }}
                  />
                  {errors.content && (
                    <p className="px-2 text-red-600 text-sm">
                      {errors.content.message}
                    </p>
                  )}

                  <div className="mt-3 p-2">
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-1">
                          <FormLabel>
                            Publish post?<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl className="col-span-2">
                            <Controller
                              name="is_active"
                              control={form.control}
                              defaultValue={field.value}
                              render={({ field: controllerField }) => (
                                <SelectUI
                                  value={controllerField.value}
                                  onValueChange={(value) =>
                                    controllerField.onChange(value)
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Posting" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value="active"
                                      className="text-green-500"
                                    >
                                      Yes
                                    </SelectItem>
                                    <SelectItem
                                      value="inactive"
                                      className="text-red-500"
                                    >
                                      No
                                    </SelectItem>
                                  </SelectContent>
                                </SelectUI>
                              )}
                            />
                          </FormControl>
                          <div></div>
                          <FormMessage className="col-span-2" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEdit(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full">
                    {isEditPost ? "Updating post..." : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );

  return null;
};
export default SingePostEdit;
