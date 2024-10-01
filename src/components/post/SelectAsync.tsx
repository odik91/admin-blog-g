import { FormType, OptionType } from "@/types/subcategoryType";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import AsyncSelect from "react-select/async";

const SelectAsync = ({
  form,
  loadOptions,
  categories,
  isCategoriesLoading,
  isError,
}: {
  form: FormType;
  loadOptions: (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => void;
  categories: OptionType[];
  isCategoriesLoading: boolean;
  isError?: boolean;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem className="grid grid-cols-3 items-center gap-1">
            <FormLabel>
              Category <span className="text-red-500">*(Required)</span>
            </FormLabel>
            <FormControl className="col-span-2">
              <AsyncSelect
                className={
                  isError
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
                placeholder="Select Category"
                isLoading={isCategoriesLoading}
              />
            </FormControl>
            <div></div>
            <FormMessage className="col-span-2" />
          </FormItem>
        )}
      />
    </>
  );
};
export default SelectAsync;
