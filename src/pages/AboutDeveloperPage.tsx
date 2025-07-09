import React from 'react';
import { motion, type Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

// --- UI BARU: DIAGRAM RADAR KEMAMPUAN ---
const SkillsRadarMockup: React.FC = () => {
  const skills = [
    { name: 'React', level: 0.9 }, // Level 0 (pusat) hingga 1 (tepi)
    { name: 'TypeScript', level: 0.85 },
    { name: 'Node.js', level: 0.75 },
    { name: '3D/R3F', level: 0.8 },
    { name: 'DevOps', level: 0.6 },
    { name: 'UI/UX Design', level: 0.9 },
  ];
  const numSkills = skills.length;

  return (
    <div className="relative mt-8 flex h-80 w-80 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm sm:h-96 sm:w-96">
      {/* Garis-garis jaring laba-laba */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-primary/10"
          style={{ width: `${(i + 1) * 25}%`, height: `${(i + 1) * 25}%` }}
        />
      ))}
      {/* Garis-garis radial */}
      {skills.map((_, index) => (
        <div
          key={index}
          className="absolute bottom-1/2 left-0 h-1/2 w-full origin-bottom border-l border-primary/10"
          style={{ transform: `rotate(${index * (360 / numSkills)}deg)` }}
        />
      ))}
      {/* Titik dan label kemampuan */}
      <div className="relative h-full w-full">
        {skills.map((skill, index) => {
          const angle = index * (360 / numSkills) - 90;
          const radius = skill.level * 45;
          const x = `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`;
          const y = `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`;
          
          const labelRadius = 55; // Jarak label dari pusat sedikit ditambah
          const labelX = `${50 + labelRadius * Math.cos((angle * Math.PI) / 180)}%`;
          const labelY = `${50 + labelRadius * Math.sin((angle * Math.PI) / 180)}%`;

          return (
            <React.Fragment key={skill.name}>
              {/* Grup Label */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: labelX, top: labelY }}
              >
                <div className="text-xs font-bold text-primary">{skill.name}</div>
                {/* Menambahkan persentase level */}
                <div className="text-[10px] font-mono text-primary/70">
                  {(skill.level * 100).toFixed(0)}%
                </div>
              </div>
              {/* Titik Kemampuan */}
              <div
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background"
                style={{ left: x, top: y }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA HALAMAN ---
export const AboutDeveloperPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-monument text-4xl uppercase text-primary md:text-5xl">
          Samuel Indra Bastian
        </h1>
        <p className="mt-2 font-satoshi text-lg text-neutral-400">
          Full-Stack Developer & Creative Technologist
        </p>
      </motion.div>

      <div className="mt-12 flex flex-col items-center">
        {/* Penjelasan Developer dengan perbaikan tata letak dan highlight */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-2xl" // Container tetap di tengah
        >
          <div className="font-satoshi text-base text-neutral-300 space-y-4 text-left md:text-lg">
            <p>
              Halo! Saya adalah seorang developer lulusan <strong className="font-bold text-white">SMK PGRI 3 Malang</strong> jurusan <strong className="font-bold text-white">Teknik Elektronika Industri</strong> yang bersemangat dalam membangun pengalaman digital yang fungsional dan estetis.
            </p>
            <p>
             Proyek "CloudNest" ini adalah wujud dari kecintaan saya terhadap antarmuka yang bersih, performa aplikasi yang tinggi, dan eksplorasi <strong className="font-bold text-white">teknologi 3D di web</strong>. Saya percaya bahwa kode yang baik tidak hanya berjalan dengan efisien, tetapi juga mampu menyajikan interaksi yang intuitif dan menyenangkan bagi pengguna.
            </p>
          </div>
        </motion.div>

        {/* Visualisasi Skill */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 w-full"
        >
          <h3 className="text-center font-monument text-2xl uppercase text-neutral-100">
            Keahlian Teknik
          </h3>
          <div className="mt-4 flex justify-center">
            <SkillsRadarMockup />
          </div>
        </motion.div>

        {/* Link Sosial Media */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-16 flex justify-center gap-8"
        >
          <a href="https://github.com/devwebxyn" target="_blank" rel="noopener noreferrer" className="font-satoshi uppercase tracking-wider text-primary transition-colors hover:text-white">GitHub</a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="font-satoshi uppercase tracking-wider text-primary transition-colors hover:text-white">LinkedIn</a>
        </motion.div>
      </div>
    </div>
  );
};