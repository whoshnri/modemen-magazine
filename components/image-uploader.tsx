'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from './toast/use-toast';

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void;
    trigger?: React.ReactNode;
    directory?: string; // Optional folder path in CDN
    className?: string; // Class for the trigger wrapper
}

export function ImageUploader({
    onUploadComplete,
    trigger,
    directory,
    className,
}: ImageUploaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {showToast} = useToast();

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            showToast("Please upload an image file", "error");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        // Construct remote path: directory/filename
        // Sanitize filename a bit to avoid encoding issues if needed, but simple is ok
        const filename = file.name.replace(/\s+/g, '-').toLowerCase();
        const remotePath = directory ? `${directory}/${Date.now()}-${filename}` : `${Date.now()}-${filename}`;
        formData.append('remotePath', remotePath);

        try {
            const res = await fetch('/api/upload-to-bunny', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.success) {
                
                onUploadComplete(data.cdnUrl);
                setIsOpen(false);
            } else {
                console.error('Upload failed', data);
                showToast(data.message || 'Upload failed', "error");
            }
        } catch (error) {
            console.error('Upload error', error);
            showToast('Something went wrong during upload', "error");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={className}>
                    {trigger || (
                        <Button variant="outline" className="rounded-none">
                            <UploadCloud className="mr-2 h-4 w-4 " />
                            Upload Image
                        </Button>
                    )}
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-none">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        'flex flex-col items-center justify-center border-2 border-dashed rounded-none p-10 transition-colors duration-200 ease-in-out cursor-pointer',
                        isDragging
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/25 hover:border-primary/50',
                        isUploading && 'pointer-events-none opacity-50'
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                    />

                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-center">
                            <div className="rounded-full bg-secondary p-4">
                                <ImageIcon className="h-8 w-8 text-secondary-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    SVG, PNG, JPG or GIF
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isUploading} className="rounded-none">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
