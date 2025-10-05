import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

type PlayerStore = {
    id: string;
    nickname: string;

    initializeId: () => void;
    setNickname: (nickname: string) => void;
}

export const usePlayer = create(persist<PlayerStore>((set, get) => ({
    id: '',
    nickname: '',

    initializeId: () => {
        const id = uuidv4();
        set({ id });
    },
    setNickname: (nickname: string) => {
        set({ nickname });
    }
}), { name: 'player' }));
