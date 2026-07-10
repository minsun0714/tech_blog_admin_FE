'use client';

import { ExcalidrawPlugin } from '@platejs/excalidraw/react';

import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-node';

export const ExcalidrawKit = [
  ExcalidrawPlugin.withComponent(ExcalidrawElement),
];
