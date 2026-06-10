import {Field, NativeSelect} from "@chakra-ui/react";
import {CURRENCY_CODES} from "../model/constants";

const CurrencySelect = ({name, value, onChange, label}) => (
    <Field.Root>
        <Field.Label fontSize="sm" color="fg.default">
            {label}
        </Field.Label>

        <NativeSelect.Root>
            <NativeSelect.Field
                name={name}
                value={value}
                onChange={onChange}
            >
                {CURRENCY_CODES.map((code) => (
                    <option key={code} value={code}>
                        {code}
                    </option>
                ))}
            </NativeSelect.Field>

            <NativeSelect.Indicator/>
        </NativeSelect.Root>
    </Field.Root>
);

export default CurrencySelect;