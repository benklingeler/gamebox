import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../utils/player';
import { Player } from '../utils/types';

export default function PlayerList({ players }: { players: Player[] }) {
    const { id } = usePlayer();

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Spieler</h2>
            <div className="flex flex-col gap-4">
                {players.map((player) => (
                    <div key={player.id} className="flex items-center gap-2">
                        <img
                            src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${player.nickname}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p>
                                {player.nickname}{' '}
                                <span className="text-gray-500">{id == player.id ? ' (Du)' : ''}</span>
                            </p>
                            <div className="text-sm text-gray-500">
                                {player.isHost ? (
                                    <>
                                        <FontAwesomeIcon icon={faCrown} className="text-yellow-500" />
                                        <span className="ml-1">Host</span>
                                    </>
                                ) : (
                                    <span>Spieler</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
