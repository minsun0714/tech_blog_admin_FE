import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import type { CategoryNode } from "@/features/category/category-api";
import { useChangeCategoryParentMutation, useCategoriesQuery } from "@/features/category/hooks/use-categories";

export type DropTargetId = number | "root" | null;

interface CategoryDndContextValue {
  draggedId: number | null;
  dropTargetId: DropTargetId;
  setDropTargetId: (id: DropTargetId) => void;
  onDragStart: (id: number) => void;
  onDragEnd: () => void;
  onDrop: (targetParentId: number | null) => void;
  isPending: boolean;
}

const CategoryDndContext = createContext<CategoryDndContextValue | null>(null);

function collectDescendantIds(nodes: CategoryNode[], result: Set<number> = new Set()): Set<number> {
  for (const node of nodes) {
    result.add(node.categoryId);
    collectDescendantIds(node.childrenCategoryList, result);
  }
  return result;
}

function findNode(nodes: CategoryNode[], id: number): CategoryNode | null {
  for (const node of nodes) {
    if (node.categoryId === id) return node;
    const found = findNode(node.childrenCategoryList, id);
    if (found) return found;
  }
  return null;
}

export function CategoryDndProvider({ children }: { children: ReactNode }) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<DropTargetId>(null);
  const { data: allCategories = [] } = useCategoriesQuery();
  const mutation = useChangeCategoryParentMutation();
  const descendantIdsRef = useRef<Set<number>>(new Set());

  const onDragStart = useCallback(
    (id: number) => {
      setDraggedId(id);
      const dragNode = findNode(allCategories, id);
      descendantIdsRef.current = dragNode
        ? collectDescendantIds(dragNode.childrenCategoryList)
        : new Set();
    },
    [allCategories],
  );

  const isInvalidDrop = (dragId: number, targetParentId: number | null): boolean => {
    if (targetParentId === null) return false;
    if (dragId === targetParentId) return true;
    return descendantIdsRef.current.has(targetParentId);
  };

  const onDrop = (targetParentId: number | null) => {
    if (draggedId === null) return;
    if (isInvalidDrop(draggedId, targetParentId)) return;
    mutation.mutate({ id: draggedId, parentId: targetParentId });
    setDraggedId(null);
    setDropTargetId(null);
  };

  return (
    <CategoryDndContext.Provider
      value={{
        draggedId,
        dropTargetId,
        setDropTargetId,
        onDragStart,
        onDragEnd: () => {
          setDraggedId(null);
          setDropTargetId(null);
        },
        onDrop,
        isPending: mutation.isPending,
      }}
    >
      {children}
    </CategoryDndContext.Provider>
  );
}

export function useCategoryDnd() {
  const ctx = useContext(CategoryDndContext);
  if (!ctx) throw new Error("useCategoryDnd must be used within CategoryDndProvider");
  return ctx;
}

