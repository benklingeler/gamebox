/**
 * BaseLayout component provides the main application structure.
 * Handles player initialization and nickname management.
 */

import { useEffect } from 'react';
import { usePlayer } from '../utils/player';
import NicknameRoute from '../routes/nickname-route';
import { faEdit, faHand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';

/**
 * Props for the BaseLayout component.
 */
type Props = {
    /** Child components to render in the main content area */
    children: React.ReactNode;
};

/**
 * Main application layout wrapper.
 * Shows nickname prompt if player hasn't set a nickname yet.
 * Renders header, main content area, and footer.
 *
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * <BaseLayout>
 *   <RouterProvider router={router} />
 * </BaseLayout>
 * ```
 */
export default function BaseLayout({ children }: Props) {
    const { id, nickname, initializeId, setNickname } = usePlayer();

    useEffect(() => {
        if (!id) {
            initializeId();
        }
    }, [id]);

    if (!nickname) {
        return <NicknameRoute />;
    }

    const resetNickname = () => {
        setNickname('');
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="h-16 flex bg-primary/5 border-b-primary border-b-2">
                <div className="container px-8 max-w-6xl mx-auto flex items-center flex-1">
                    <div className="flex flex-1 items-center gap-4">
                        <a href="/">
                            <h1 className="text-primary text-2xl uppercase font-bold tracking-widest">Gamebox</h1>
                        </a>
                        <p className="text-primary text-lg">
                            Hallo {nickname}! <FontAwesomeIcon icon={faHand} className="rotate-45 text-primary" />
                        </p>
                    </div>
                    <button className="button" onClick={resetNickname}>
                        <FontAwesomeIcon icon={faEdit} />
                        Spitznamen ändern
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto flex">
                <div className="container px-8 max-w-6xl mx-auto flex-1 py-12 flex flex-col justify-center">
                    {children}
                </div>
            </main>
            <footer className="h-16 flex items-center justify-center bg-gradient-to-t from-primary/10 to-transparent">
                <p className="text-sm text-muted">Copyright © 2025 Ben Klingeler</p>
            </footer>
        </div>
    );
}
