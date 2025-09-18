import React from 'react'
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
    FormField as ShadcnFormField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Control, FieldPath, FieldValues } from 'react-hook-form'

interface BaseFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
    control: Control<TFieldValues>
    name: TName
    label?: string
    description?: string
    placeholder?: string
    className?: string
    disabled?: boolean
    required?: boolean
}

interface InputFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
    type: 'input'
    inputType?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
}

interface TextareaFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
    type: 'textarea'
    rows?: number
    maxLength?: number
    showCharacterCount?: boolean
    resize?: boolean
}

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
    type: 'select'
    options: SelectOption[]
    emptyText?: string
}

interface FileFormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
    type: 'file'
    accept?: string
    multiple?: boolean
    maxSize?: number // in bytes
    onFileChange?: (files: FileList | null) => void
}

type FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> =
    | InputFormFieldProps<TFieldValues, TName>
    | TextareaFormFieldProps<TFieldValues, TName>
    | SelectFormFieldProps<TFieldValues, TName>
    | FileFormFieldProps<TFieldValues, TName>

export function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldProps<TFieldValues, TName>) {
    const { control, name, label, description, className, disabled, required } = props

    return (
        <ShadcnFormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel
                            className={cn(
                                required &&
                                    "after:content-['*'] after:ml-0.5 after:text-destructive"
                            )}>
                            {label}
                        </FormLabel>
                    )}

                    <FormControl>
                        {(() => {
                            switch (props.type) {
                                case 'input':
                                    return (
                                        <Input
                                            {...field}
                                            type={props.inputType || 'text'}
                                            placeholder={props.placeholder}
                                            disabled={disabled}
                                            className={fieldState.error ? 'border-destructive' : ''}
                                        />
                                    )

                                case 'textarea':
                                    const characterCount = field.value?.length || 0
                                    const maxLength = props.maxLength

                                    return (
                                        <div className="space-y-2">
                                            <Textarea
                                                {...field}
                                                placeholder={props.placeholder}
                                                disabled={disabled}
                                                rows={props.rows}
                                                maxLength={maxLength}
                                                className={cn(
                                                    fieldState.error && 'border-destructive',
                                                    !props.resize && 'resize-none'
                                                )}
                                            />
                                            {props.showCharacterCount && maxLength && (
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span>
                                                        {characterCount} / {maxLength} characters
                                                    </span>
                                                    {characterCount > maxLength * 0.8 && (
                                                        <span
                                                            className={cn(
                                                                characterCount === maxLength
                                                                    ? 'text-destructive'
                                                                    : 'text-amber-500'
                                                            )}>
                                                            {maxLength - characterCount} characters
                                                            left
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )

                                case 'select':
                                    return (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={disabled}>
                                            <SelectTrigger
                                                className={
                                                    fieldState.error ? 'border-destructive' : ''
                                                }>
                                                <SelectValue
                                                    placeholder={
                                                        props.placeholder || 'Select an option'
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {props.options.length === 0 ? (
                                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                                        {props.emptyText || 'No options available'}
                                                    </div>
                                                ) : (
                                                    props.options.map(option => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            disabled={option.disabled}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )

                                case 'file':
                                    return (
                                        <Input
                                            type="file"
                                            accept={props.accept}
                                            multiple={props.multiple}
                                            disabled={disabled}
                                            className={cn(
                                                fieldState.error && 'border-destructive',
                                                'file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                                            )}
                                            onChange={e => {
                                                const files = e.target.files

                                                // File size validation
                                                if (files && props.maxSize) {
                                                    const oversizedFiles = Array.from(files).filter(
                                                        file => file.size > props.maxSize!
                                                    )
                                                    if (oversizedFiles.length > 0) {
                                                        e.target.value = ''
                                                        return
                                                    }
                                                }

                                                if (props.onFileChange) {
                                                    props.onFileChange(files)
                                                }

                                                if (!props.multiple && files && files.length > 0) {
                                                    field.onChange(files[0])
                                                } else if (props.multiple) {
                                                    field.onChange(files)
                                                } else {
                                                    field.onChange('')
                                                }
                                            }}
                                        />
                                    )

                                default:
                                    return null
                            }
                        })()}
                    </FormControl>

                    {description && <FormDescription>{description}</FormDescription>}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
