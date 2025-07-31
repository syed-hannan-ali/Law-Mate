import { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@components/ui/command";
import { Checkbox } from "@components/ui/checkbox";
import { Button } from "@components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

export default function StaffMultiSelect({
    staff,
    selectedStaff,
    setSelectedStaff,
}) {
    const safeSelectedStaff = Array.isArray(selectedStaff)
        ? [...selectedStaff] // ensure clone and array
        : [];

    const [open, setOpen] = useState(false);

    const toggleStaff = (id) => {
        const updated = safeSelectedStaff.includes(id)
            ? safeSelectedStaff.filter((sid) => sid !== id)
            : [...safeSelectedStaff, id];

        setSelectedStaff(updated);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {safeSelectedStaff.length > 0
                        ? `${safeSelectedStaff.length} staff selected`
                        : "Select staff"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandGroup>
                        {staff.map((person) => (
                            <CommandItem
                                key={person._id}
                                onSelect={() => toggleStaff(person._id)}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    checked={safeSelectedStaff.includes(person._id)}
                                    onCheckedChange={() =>
                                        toggleStaff(person._id)
                                    }
                                    className="mr-2"
                                />
                                <span>
                                    {person.username} ({person.role})
                                </span>
                                {safeSelectedStaff.includes(person._id) && (
                                    <Check className="ml-auto h-4 w-4 opacity-50" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
