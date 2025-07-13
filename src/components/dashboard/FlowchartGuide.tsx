import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VscSettings, VscPlug, VscArrowRight } from 'react-icons/vsc';
import { FaGoogleDrive } from 'react-icons/fa';

export const FlowchartGuide: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.5, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="text-center py-16 px-4">
            <motion.h1 variants={itemVariants} className="font-monument text-4xl text-white">
                Aktifkan Brankas Google Drive Anda
            </motion.h1>
            <motion.p variants={itemVariants} className="text-neutral-400 max-w-xl mx-auto mt-2 mb-12">
                Ikuti tiga langkah mudah ini untuk menautkan akun Anda dan mulai mengelola file dengan aman.
            </motion.p>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0"
            >
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 hidden md:block" />
                <motion.div
                    className="absolute top-1/2 left-0 h-0.5 bg-primary hidden md:block"
                    initial={{ width: 0 }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                />
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center text-4xl text-primary">
                        <VscSettings />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 1</h3>
                    <p className="text-xs text-neutral-400 h-10">Buka Pengaturan melalui foto profil anda.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center text-4xl text-primary">
                        <VscPlug />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 2</h3>
                    <p className="text-xs text-neutral-400 h-10">Pilih menu "Integrasi" di dropdown.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative z-10 flex flex-col items-center w-52">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-primary/50 flex items-center justify-center text-4xl text-green-400">
                        <FaGoogleDrive />
                    </div>
                    <h3 className="mt-4 font-bold text-white">Langkah 3</h3>
                    <p className="text-xs text-neutral-400 h-10">Klik tombol "Tautkan Akun" dan berikan izin.</p>
                </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <Link to="/dashboard/integrations" className="mt-12 bg-primary text-background font-bold px-8 py-3 rounded-md inline-flex items-center gap-3 group">
                    Mulai Penautan <VscArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>
        </div>
    );
};