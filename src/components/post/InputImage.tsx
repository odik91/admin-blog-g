import { FormType } from "@/types/subcategoryType";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputFileProps = "image" | "thumbnail";

const InputImage = ({
  form,
  fieldName,
  maxSize,
  title,
}: {
  form: FormType;
  fieldName: InputFileProps;
  maxSize: number;
  title: string;
}) => {
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
                    form.clearErrors(fieldName)
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
