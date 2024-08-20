import { useEffect, useState } from 'react';

type zipProps = {
    zipCode: string,
    onZipCodeChange: (newZipCode: string) => void,
}

export const ZipCodeInput = ({ zipCode, onZipCodeChange } : zipProps) => {

    const [zipInput, setZipInput] = useState<string>(zipCode);

    useEffect(() => {
        setZipInput(zipCode);
    }, [zipCode])

    const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newZipCode = event.target.value;
        setZipInput(newZipCode);

        // Validate if the new ZIP code is 5 digits or has been fully deleted
        if (newZipCode.length === 5 || newZipCode.length === 0) {
            onZipCodeChange(newZipCode);  // Call the parent callback with the new ZIP code
        }
    };

    const handleZipInput = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (input.value.length > 5) {
          input.value = input.value.slice(0, 5);
        }
      };

    return (
        <div>
            <label
                htmlFor='zip-code'
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
            >
                Zip Code
            </label>
            <input
                type="number"
                id="zip-code"
                value={zipInput}
                onChange={handleZipCodeChange}
                onInput={handleZipInput}
                max="99999"
                pattern="/^-?\d+\.?\d*$/"
                className="mt-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
        </div>
    );
}