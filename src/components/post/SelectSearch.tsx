import { FormType, OptionType } from "@/types/subcategoryType";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Select from "react-select";

const SelectSearch = ({
  form,
  dataSelect,
  isError,
}: {
  form: FormType;
  dataSelect: OptionType[];
  isError?: boolean;
}) => {
  return (
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
                isError
                  ? "border border-red-500 rounded-sm"
                  : form.getValues("subcategory_id")
                  ? "border border-green-500 rounded-sm"
                  : ""
              }
              options={dataSelect || []}
              {...field}
              value={
                dataSelect?.find(
                  (option: { value: string }) => option.value === field.value
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
  );
};
export default SelectSearch;
