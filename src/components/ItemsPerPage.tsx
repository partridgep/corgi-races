import { useEffect, useState } from 'react';

type perPageProps = {
    num: number,
    onPerPageChange: (newNum: number) => void,
}

const ItemsPerPage = ({ num, onPerPageChange } : perPageProps) => {

    const [numInput, setNumInput] = useState<number>(num);

    function useDebounce<T>(value: T, delay: number): T {
        const [debouncedValue, setDebouncedValue] = useState(value);
    
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
    
            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);
    
        return debouncedValue;
    }

    // Use the debounce hook with a delay (e.g., 300 milliseconds)
    const debouncedNumInput = useDebounce(numInput, 300);

    useEffect(() => {
        console.log("useEffect1", num)
        setNumInput(num);
    }, [num]);

    useEffect(() => {
        console.log("useEffect2", debouncedNumInput, onPerPageChange)
        // Trigger the callback with the debounced value
        onPerPageChange(debouncedNumInput);
    }, [debouncedNumInput, onPerPageChange]);

    const handlePerPageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNum = parseInt(event.target.value);
        setNumInput(newNum);
    };

    return (
        <div className='flex items-center gap-x-2'>
            <label
                htmlFor='num-per-page'
                className="block text-sm leading-6 text-gray-900 dark:text-gray-200"
            >
                Results per page
            </label>
            <input
                type="number"
                id="num-per-page"
                value={numInput}
                step="1"
                max="100"
                onChange={handlePerPageChange}
                className="w-16 font-semibold rounded-md border-0 py-1 text-gray-900 dark:bg-zinc-800 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
        </div>
    )
}

export default ItemsPerPage;