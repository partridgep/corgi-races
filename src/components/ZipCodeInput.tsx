import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

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
        <div className='w-full sm:w-auto flex flex-col sm:flex-row sm:items-center justify-start gap-2'>
            <label
                htmlFor='zip-code'
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
            >
                Zip Code
            </label>
            <div className='wrapper relative'>
                <input
                    type="number"
                    id="zip-code"
                    value={zipInput}
                    onChange={handleZipCodeChange}
                    onInput={handleZipInput}
                    max="99999"
                    placeholder='ZIP'
                    pattern="/^-?\d+\.?\d*$/"
                    className="w-full sm:w-28 block rounded-md border-0 py-2 sm:py-1.5 pl-8 sm:pl-7 text-gray-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                </input>
                <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 absolute left-2 sm:left-1.5 top-3 sm:top-2.5" aria-hidden="true" />
            </div>
        </div>
    );
}