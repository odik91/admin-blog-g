import { useGetCategoriesNonFiltering } from "@/actions/category";
import { useGetSubcategoriesNonFiltering } from "@/actions/subcategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent, FormControl } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

import { OptionType } from "@/types/subcategoryType";
import { Editor } from "@tinymce/tinymce-react";
import { Switch } from "../ui/switch";
import SelectAsync from "./SelectAsync";
import SelectSearch from "./SelectSearch";
import InputText from "./InputText";

const formSchema = z.object({
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
  thumbnail: z
    .instanceof(FileList, { message: "Thumbnail is required" })
    .refine((files) => files, { message: "Thumbnail is required" })
    .refine((files) => files && files.length > 0, {
      message: "File is required",
    })
    .refine(
      (files) => files.length === 0 || files[0]?.size <= 2 * 1024 * 1024, // 2MB max size
      { message: "File must be less than 2MB" }
    )
    .refine(
      (files) => files.length === 0 || files[0]?.type.startsWith("image/"), // Check file type
      { message: "Only image files are allowed" }
    ),
  image: z
    .instanceof(FileList, { message: "Image is required" })
    .refine((files) => files, { message: "Image is required" })
    .refine((files) => files.length > 0, { message: "Image is required" })
    .refine(
      (files) => files.length === 0 || files[0]?.size <= 3 * 1024 * 1024, // 3MB max size
      { message: "File must be less than 3MB" }
    )
    .refine(
      (files) => files.length === 0 || files[0]?.type.startsWith("image/"), // Check file type
      { message: "Only image files are allowed" }
    ),
  meta_description: z
    .string()
    .min(5, { message: "Please insert meta description" })
    .max(300, {
      message:
        "Meta description length should not be longer than 300 characters.",
    }),
  meta_keyword: z.string().min(3, { message: "Please insert meta keyword" }),
  seo_title: z.string().min(3, { message: "Please insert seo title" }),
  is_active: z.enum(["active", "inactive"]),
  content: z.string().min(3, { message: "Please insert post content" }),
});

const AddPost = () => {
  const [addPost, setAddPost] = useState(false);
  const [titleLength, setTitleLength] = useState({ changed: false, chars: 0 });
  const [metaDescription, setMetaDescription] = useState({
    changed: false,
    chars: 0,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: "",
      subcategory_id: "",
      title: "",
      thumbnail: undefined,
      image: undefined,
      meta_description: "",
      meta_keyword: "",
      seo_title: "",
      is_active: "inactive",
      content: "",
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  // const fetchCategories = async (searchTerm = "") => {
  //   setLoading(true);
  //   try {
  //     const response = await customFetch.get(
  //       `/category/non-sort${searchTerm ? `?search=${searchTerm}` : ``}`
  //     );

  //     setCategories(
  //       response.data.map((category: { id: number; name: string }) => ({
  //         value: category.id,
  //         label: category.name,
  //       }))
  //     );
  //   } catch (error: unknown) {
  //     console.log(`Error fetching data: ${error}`);
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.status === 401) {
  //         dispatch(logoutUser());
  //       }
  //     }
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const debouncedFetchCategories = useCallback(
  //   debounce((inputValue: string, callback) => {
  //     fetchCategories(inputValue);
  //     callback(categories); // Mengembalikan hasil kategori ke AsyncSelect
  //   }, 500), // Waktu debounce 500ms
  //   [categories]
  // );

  // const loadOptions = (
  //   inputValue: string,
  //   callback: (options: OptionType[]) => void
  // ) => {
  //   debouncedFetchCategories(inputValue, callback);
  // };

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

  // const debounce = () => {
  //   let timeoutID: number;
  //   return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //     setLocalSearch(e.target.value);
  //     clearTimeout(timeoutID);
  //     timeoutID = setTimeout(() => {
  //       dispatch(handleChange({ name: e.target.name, value: e.target.value }));
  //     }, 1000);
  //   };
  // };

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <div className="flex justify-between items-center p-3 gap-3">
        <Button variant="outline" onClick={() => setAddPost(!addPost)}>
          Add Post
        </Button>
      </div>
      <Card className="m-3">
        <CardHeader className="bg-slate-50 p-3">
          <CardTitle className="text-center text-xl">Add New Post</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="border p-3 rounded-md shadow-md">
                <h1 className="font-semibold text-center">Section Title</h1>
                <Separator className="my-3" />
                {/* select category */}
                <SelectAsync
                  form={form}
                  loadOptions={loadOptions}
                  categories={categories}
                  isCategoriesLoading={isCategoriesLoading}
                  isError={errors.category_id ? true : false}
                />

                {/* Subcategory Field */}
                <SelectSearch
                  form={form}
                  dataSelect={subcategories}
                  isError={errors.subcategory_id ? true : false}
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

                {/* thumbnail */}
                <FormField
                  control={control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-1">
                      <FormLabel>
                        Thumbnail{" "}
                        <span className="text-red-500">* (max 2mb)</span>
                      </FormLabel>
                      <FormControl className="col-span-2">
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            field.onChange(file ? [file] : null); // Ensure file list is passed
                          }}
                        />
                      </FormControl>
                      <div></div>
                      <FormMessage className="col-span-2" />
                    </FormItem>
                  )}
                />

                {/* image */}
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-3 items-center gap-1">
                      <FormLabel>
                        Image <span className="text-red-500">* (max 3mb)</span>
                      </FormLabel>
                      <FormControl className="col-span-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            field.onChange(file ? [file] : null); // Ensure file list is passed
                          }}
                        />
                      </FormControl>
                      <div></div>
                      <FormMessage className="col-span-2" />
                    </FormItem>
                  )}
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
                <label htmlFor="content" className="font-semibold text-center">
                  Content
                </label>
                <Separator className="my-3" />
                <Editor
                  id="content"
                  apiKey="qjamfcgnfhw26lja33d33fxy5ugdq62ob0peiyn3v2xcijvw"
                  licenseKey="gpl"
                  initialValue="<p>Write your content here...</p>"
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
                    setValue("content", content); // Update form state when TinyMCE content changes
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
                          <div className="flex justify-start items-center">
                            <span className="p-2 text-red-600">No</span>
                            <Switch id="is_active" {...field} />
                            <span className="p-2 text-green-600">Yes</span>
                          </div>
                        </FormControl>
                        <div></div>
                        <FormMessage className="col-span-2" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mt-3">
                <Button type="submit" className="w-full">
                  {/* {is_loading ? "Please wait..." : "Save"} */}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
export default AddPost;
