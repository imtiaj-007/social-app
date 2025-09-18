'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmationModalProps {
    trigger?: React.ReactNode
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void | Promise<void>
    onCancel?: () => void
    variant?: 'default' | 'destructive'
    isLoading?: boolean
}

export function ConfirmationModal({
    trigger,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'destructive',
    isLoading = false,
}: ConfirmationModalProps) {
    const [open, setOpen] = useState<boolean>(false)

    const handleConfirm = async () => {
        await onConfirm()
        setOpen(false)
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button
                        variant={variant}
                        size="sm">
                        {confirmText}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        disabled={isLoading}>
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
