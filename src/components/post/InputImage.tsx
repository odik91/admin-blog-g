import { FormType } from "@/types/subcategoryType";
import { api_url } from "@/utils/axios";
import { useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputFileProps = "image";

const InputImage = ({
  form,
  fieldName,
  maxSize,
  title,
  defaultFile,
}: {
  form: FormType;
  fieldName: InputFileProps;
  maxSize: number;
  title: string;
  defaultFile?: string;
}) => {
  const fetchFileFromUrl = async (url: string) => {
    if (defaultFile) {
      try {
        const response = await fetch(url, { mode: "no-cors" });
        const blob = await response.blob();
        const fileName = url.split("/").pop() || "downloaded_file";

        let fileType = "";
        if (response.type === "opaque") {
          fileType = "image/png";
        } else {
          fileType = "image/png";
        }

        const newFile = new File([blob], fileName, { type: fileType });
        
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        const fileList = dataTransfer.files;
        
        form.setValue(fieldName, fileList);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }
  };

  useEffect(() => {
    fetchFileFromUrl(api_url + defaultFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFile]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center gap-1">
          <FormLabel className="capitalize">
            {title} <span className="text-red-500">* (max {maxSize}mb)</span>
          </FormLabel>
          <FormControl className="col-span-2">
            <Input
              className={
                form.formState.errors[fieldName]
                  ? "border border-red-500 rounded-sm"
                  : form.getValues(fieldName)
                  ? "border border-green-500 rounded-sm"
                  : ""
              }
              id={fieldName}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                field.onChange(file);
                if (e.target.files) {
                  const size = e.target.files[0].size;

                  form.setValue(fieldName, e.target.files);
                  if (size > maxSize * 1000000) {
                    form.setError(fieldName, {
                      type: "manual",
                      message: `Image size should not exceed ${maxSize}MB`,
                    });
                  } else {
                    form.clearErrors(fieldName);
                  }
                }
              }}
            />
          </FormControl>
          <div></div>
          <FormMessage className="col-span-2" />
        </FormItem>
      )}
    />
  );
};
export default InputImage;
