import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutGrid } from "lucide-react";
import { useCharts } from "@/stores/useCharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StatusUpdatesDisplay } from "./StatusUpdatesDisplay";
import { useAnnotations } from "@/stores/useAnnotations";
import { TutorialsToggle } from "./TutorialsToggle";

interface WorkbenchModeProps {
    tutorialsOpen: boolean;
    toggleTutorials: () => void;
}

export function WorkbenchMenu({ tutorialsOpen, toggleTutorials }: WorkbenchModeProps) {
    const { setLayout } = useCharts();
    const router = useRouter();
    const pathname = usePathname();

    const handleValueChange = (value: string) => {
        router.push(`/workbench/${value}`);
    };

    const toggleAnnotations = () => {
        const { isOpen } = useAnnotations.getState();
        useAnnotations.setState({ isOpen: !isOpen });
    };

    return (
        <div className="p-4 border-b flex items-center justify-between">
            <Select value={pathname.split("/").pop()} onValueChange={handleValueChange}>
                <SelectTrigger className="max-w-48 h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="lens">Lens</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <StatusUpdatesDisplay />
                <Button variant="outline" size="sm" onClick={toggleAnnotations}>
                    <SquarePen size={16} />
                    Annotate
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                            <LayoutGrid size={16} />
                            Layout
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLayout("1x1")}>1x1</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLayout("2x1")}>2x1</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLayout("2x2")}>2x2</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <TutorialsToggle 
                    tutorialsOpen={tutorialsOpen} 
                    toggleTutorials={toggleTutorials} 
                />
            </div>
        </div>
    );
}
