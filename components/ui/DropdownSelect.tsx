import {
    FormControl,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

export function DropdownSelect({ field, options, placeholder }: any) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant="outline" className="w-full justify-between">
                        {field.value ? options.find((opt: any) => opt.value === field.value)?.label : placeholder}
                        <CaretSortIcon className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option: any) => (
                                <CommandItem key={option.value} onSelect={() => field.onChange(option.value)}>
                                    {option.label}
                                    <CheckIcon className={`ml-auto h-4 w-4 ${field.value === option.value ? "opacity-100" : "opacity-0"}`} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
