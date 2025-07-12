import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VscChromeClose } from 'react-icons/vsc';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
    isLoading: boolean;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate, isLoading }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && !isLoading) {
            onCreate(name.trim());
            setName('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0" onClick={onClose} />
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="relative bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-sm"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                    >
                        <h3 className="text-lg font-bold text-white mb-4">Buat Folder Baru</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama folder"
                            className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white focus:ring-primary focus:border-primary"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button type="button" onClick={onClose} className="bg-neutral-600 px-4 py-2 rounded-md text-sm hover:bg-neutral-500">Batal</button>
                            <button type="submit" disabled={isLoading} className="bg-primary text-background px-4 py-2 rounded-md text-sm font-bold disabled:bg-neutral-500">
                                {isLoading ? 'Membuat...' : 'Buat'}
                            </button>
                        </div>
                        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
                            <VscChromeClose />
                        </button>
                    </motion.form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};