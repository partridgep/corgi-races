import { useEffect, useState } from 'react';
// import { useSearchParams } from "react-router-dom";

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

    return (
        <div>
            <input
                type="number"
                id="zip-code"
                value={zipInput}
                onChange={handleZipCodeChange}
                className='text-black p-2 rounded'
            />
        </div>
    );
}