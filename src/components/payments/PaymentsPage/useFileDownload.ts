// hooks/useFileDownload.ts
import { useCallback } from 'react';

type SupportedFileType = 'pdf' | 'jpg';

const MIME_TYPES: Record<SupportedFileType, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
};

export function useFileDownload() {
  const downloadFile = useCallback((base64Data: string, filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() as SupportedFileType;
    const mimeType = MIME_TYPES[extension];

    if (!mimeType) {
      console.error('Unsupported file type');
      return;
    }

    const blob = base64ToBlob(base64Data, mimeType);
    triggerDownload(blob, filename);
  }, []);

  return { downloadFile };
}

/* ---------------- Helpers ---------------- */

function base64ToBlob(base64Data: string, contentType: string): Blob {
  const binary = atob(base64Data.replace(/\s/g, ''));
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }

  return new Blob([view], { type: contentType });
}

function triggerDownload(blob: Blob, filename: string) {
  // IE / Edge legacy
  // @ts-expect-error – legacy browser support
  if (window.navigator.msSaveBlob) {
    // @ts-expect-error – legacy browser support
    window.navigator.msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  URL.revokeObjectURL(url);
  anchor.remove();
}
