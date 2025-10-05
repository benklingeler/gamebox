/**
 * NicknameRoute component for setting the player's nickname.
 * Shown on first visit or when nickname is not set.
 */

import { useState } from 'react';
import { usePlayer } from '../utils/player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * Nickname input and management component.
 * Validates nickname length (3-20 characters) and persists to local storage.
 *
 * @returns React component
 *
 * @example
 * ```tsx
 * <NicknameRoute />
 * ```
 */
export default function NicknameRoute() {
    const [value, setValue] = useState<string>('');
    const { setNickname } = usePlayer();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (value.length < 3) {
            alert('Nickname must be at least 3 characters long.');
            return;
        }

        if (value.length > 20) {
            alert('Nickname must be at most 20 characters long.');
            return;
        }

        e.preventDefault();
        setNickname(value);
    };

    return (
        <div className="flex flex-col gap-8 items-center justify-center h-full">
            <h2 className="text-xl font-extrabold">Dein Spitzname?</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-64">
                <input
                    className="w-full py-1 px-2 bg-input text-input-foreground focus:outline-none"
                    placeholder="Enter your nickname"
                    type="text"
                    value={value}
                    onChange={handleChange}
                    maxLength={20}
                />
                <div className="flex items-center flex-1 gap-4 w-full">
                    <button
                        className="flex items-center justify-center gap-1 flex-1 py-1 px-2 bg-primary text-primary-foreground cursor-pointer"
                        type="submit"
                    >
                        <FontAwesomeIcon icon={faSave} /> Speichern
                    </button>
                    <button
                        className="flex items-center justify-center gap-1 flex-1 py-1 px-2 bg-muted text-muted-foreground cursor-pointer"
                        onClick={() => setNickname('')}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Löschen
                    </button>
                </div>
            </form>
        </div>
    );
}
