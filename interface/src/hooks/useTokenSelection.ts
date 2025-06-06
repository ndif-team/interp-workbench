import { useState } from "react";
import { Token } from "@/types/tokenizer";
import { LensCompletion } from "@/types/lens";
import { useTutorialManager } from "./useTutorialManager";

interface UseTokenSelectionProps {
    compl: LensCompletion;
    removeToken: (idxs: number[]) => void;
}

export function useTokenSelection({ compl, removeToken }: UseTokenSelectionProps) {
    const [highlightedTokens, setHighlightedTokens] = useState<number[]>(compl.tokens.map(t => t.idx));
    const [isSelecting, setIsSelecting] = useState(false);
    const [startToken, setStartToken] = useState<number | null>(null);
    const { handleTokenHighlight } = useTutorialManager();

    const getTokenIdFromEvent = (e: React.MouseEvent): number | null => {
        const target = e.target as HTMLElement;
        const tokenElement = target.closest("[data-token-id]");
        if (tokenElement) {
            return parseInt(tokenElement.getAttribute("data-token-id") || "0", 10);
        }
        return null;
    };

    const getGroupInformation = (i: number, tokenData: Token[]) => {
        const isHighlighted = highlightedTokens.includes(i);
        const isPrevHighlighted = i > 0 && highlightedTokens.includes(i - 1);
        const isNextHighlighted = i < tokenData.length - 1 && highlightedTokens.includes(i + 1);

        // Determine if this token is part of a group
        const isGroupStart = isHighlighted && !isPrevHighlighted;
        const isGroupEnd = isHighlighted && !isNextHighlighted;

        // Calculate group ID
        let groupId = -1;
        if (isHighlighted) {
            if (isGroupStart) {
                // Find the end of this group
                let groupEnd = i;
                while (
                    groupEnd < tokenData.length - 1 &&
                    highlightedTokens.includes(groupEnd + 1)
                ) {
                    groupEnd++;
                }
                groupId = i; // Use start index as group ID
            } else {
                // Find the start of this group
                let groupStart = i;
                while (groupStart > 0 && highlightedTokens.includes(groupStart - 1)) {
                    groupStart--;
                }
                groupId = groupStart;
            }
        }

        return {
            isHighlighted,
            groupId,
            isGroupStart,
            isGroupEnd,
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        setIsSelecting(true);
        const tokenId = getTokenIdFromEvent(e);

        if (tokenId !== null) {
            handleTokenHighlight(tokenId);
            console.log("token clicked", tokenId);

            if (highlightedTokens.includes(tokenId)) {
                // Unhighlight this specific token
                const newHighlighted = highlightedTokens.filter((id) => id !== tokenId);
                setHighlightedTokens(newHighlighted);
                console.log("Removing token click", tokenId);
                removeToken([tokenId]);
            } else {
                // If Ctrl/Cmd is pressed, add to existing selection
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                    setStartToken(tokenId);
                    const newHighlighted = [...highlightedTokens, tokenId];
                    setHighlightedTokens(newHighlighted);
                } else {
                    // Start new selection (this will clear previous highlights)
                    setStartToken(tokenId);
                    setHighlightedTokens([tokenId]);
                    
                    // Remove target token id
                    const tokensToRemove = highlightedTokens.filter(id => id !== tokenId);
                    removeToken(tokensToRemove);
                }
            }
        }
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        setStartToken(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting || startToken === null) return;

        const currentToken = getTokenIdFromEvent(e);
        if (currentToken === null) return;

        const start = Math.min(startToken, currentToken);
        const end = Math.max(startToken, currentToken);
        const newHighlightedTokens = Array.from({ length: end - start + 1 }, (_, i) => start + i);

        // If Ctrl/Cmd is pressed, add to existing selection
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
            const combined = [...highlightedTokens, ...newHighlightedTokens];
            const unique = [...new Set(combined)];
            setHighlightedTokens(unique);
        } else {
            setHighlightedTokens(newHighlightedTokens);
        }
    };

    return {
        highlightedTokens,
        getGroupInformation,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
    };
}
