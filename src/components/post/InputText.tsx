import { FormType } from "@/types/subcategoryType";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";

type InputFieldName =
  | "title"
  | "content"
  | "meta_description"
  | "meta_keyword"
  | "seo_title";

const InputText = ({
  inputName,
  title,
  placeholder,
  minLength = 0,
  maxLength,
  form,
}: {
  inputName: InputFieldName; // Correct the name type
  title: string;
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  form: FormType;
}) => {
  const [titleLength, setTitleLength] = useState({ changed: false, chars: 0 });

  return (
    <FormField
      control={form.control}
      name={inputName}
      render={({ field }) => (
        <FormItem className="grid grid-cols-3 items-center gap-1">
          <FormLabel className="capitalize">
            {title} <span className="text-red-500">* </span>
            {maxLength && (
              <>
                (<span className="text-red-500">{titleLength.chars || field.value.toString().length}</span>/
                {maxLength || 300}chars)
              </>
            )}
          </FormLabel>
          <FormControl className="col-span-2">
            <Input
              className={
                !titleLength.changed
                  ? ""
                  : titleLength.chars > minLength && titleLength.changed
                  ? "border border-green-500 rounded-sm"
                  : "border border-red-500 rounded-sm"
              }
              placeholder={placeholder}
              {...field}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length <= (maxLength || 100000)) {
                  setTitleLength({
                    changed: true,
                    chars: e.target.value.length,
                  });
                  form.setValue(inputName, e.target.value);
                  form.clearErrors(inputName);
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
export default InputText;
