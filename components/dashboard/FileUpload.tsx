'use client';

import { useState, useCallback, useMemo } from 'react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@uploadthing/react';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { UploadFileResponse } from 'uploadthing/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

const IMG_MAX_LIMIT = 3;

interface ImageUploadProps {
  onChange?: (files: UploadFileResponse[]) => void;
  onRemove: (value: UploadFileResponse[]) => void;
  value: UploadFileResponse[];
}

export default function FileUpload({
                                     onChange,
                                     onRemove,
                                     value
                                   }: ImageUploadProps) {
  const { toast } = useToast();

  const onDeleteFile = useCallback((key: string) => {
    const filteredFiles = value.filter((item) => item.key !== key);
    onRemove(filteredFiles);
  }, [value, onRemove]);

  const onUpdateFile = useCallback((newFiles: UploadFileResponse[]) => {
    onChange && onChange([...value, ...newFiles]);
  }, [value, onChange]);

  const renderImagePreview = useMemo(() => (
      value.length > 0 &&
      value.map((item) => (
          <div
              key={item.key}
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
          >
            <div className="absolute right-2 top-2 z-10">
              <Button
                  type="button"
                  onClick={() => onDeleteFile(item.key)}
                  variant="destructive"
                  size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
                fill
                className="object-cover"
                alt="Image"
                src={item.url || ''}
            />
          </div>
      ))
  ), [value, onDeleteFile]);

  return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          {renderImagePreview}
        </div>
        <div>
          {value.length < IMG_MAX_LIMIT && (
              <UploadDropzone<OurFileRouter>
                  className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800"
                  endpoint="imageUploader"
                  config={{ mode: 'auto' }}
                  content={{
                    allowedContent({ isUploading }) {
                      if (isUploading) {
                        return (
                            <p className="mt-2 animate-pulse text-sm text-slate-400">
                              Img Uploading...
                            </p>
                        );
                      }
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    if (res) {
                      onUpdateFile(res);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: 'Error',
                      variant: 'destructive',
                      description: error.message,
                    });
                  }}
              />
          )}
        </div>
      </div>
  );
}
