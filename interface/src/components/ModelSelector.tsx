import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { useModels } from "@/hooks/useModels";
import { useSelectedModel } from "@/hooks/useSelectedModel";

export function ModelSelector() {
    const { baseModels, chatModels, isLoading } = useModels();
    const { modelName, handleModelChange } = useSelectedModel();

    return (
        <Select value={modelName} onValueChange={handleModelChange}>
            <SelectTrigger className={cn("w-[220px]", {
                "animate-pulse": isLoading
            })}>
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
                {baseModels.length > 0 && (
                    <SelectGroup>
                        <SelectLabel>Base Models</SelectLabel>
                        {baseModels.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                    </SelectGroup>
                )}
                {chatModels.length > 0 && (
                    <SelectGroup>
                        <SelectLabel>Chat Models</SelectLabel>
                        {chatModels.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                    </SelectGroup>
                )}
                {isLoading && (
                    <SelectItem value="loading" disabled>Loading models...</SelectItem>
                )}
            </SelectContent>
        </Select>
    )
}
