import {Field, Input} from "@chakra-ui/react";

export const FormField = ({field, value, onChange}) => (
    <Field.Root required={field.required} gridColumn={field.colSpan === 2 ? 'span 2' : undefined}>
        <Field.Label fontSize="sm">{field.label}</Field.Label>
        <Input
            name={field.name}
            type={field.type ?? 'text'}
            value={value}
            onChange={onChange}
            placeholder={field.placeholder}
        />
    </Field.Root>
);