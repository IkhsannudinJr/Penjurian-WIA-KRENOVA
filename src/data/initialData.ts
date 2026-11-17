import { Criterion, Judge, Nominator } from '../types';

export const WIA_CRITERIA: Criterion[] = [
  {
    id: 'latar_belakang',
    name: 'Latar Belakang',
    weight: 15,
    description: 'Urgensi masalah, kesesuaian isu strategis daerah, dan landasan inovasi yang diusulkan.'
  },
  {
    id: 'komitmen_manajerial',
    name: 'Komitmen dan Manajerial',
    weight: 10,
    description: 'Dukungan kepemimpinan, regulasi, alokasi sumber daya, dan tata kelola inovasi.'
  },
  {
    id: 'kebaharuan',
    name: 'Unsur Kebaharuan',
    weight: 25,
    description: 'Orisinalitas ide, keunikan gagasan, atau modifikasi signifikan dibanding metode yang ada.'
  },
  {
    id: 'dampak_manfaat',
    name: 'Dampak dan Manfaat',
    weight: 30,
    description: 'Kemanfaatan nyata bagi masyarakat/layanan publik, efisiensi anggaran/waktu, dan output terukur.'
  },
  {
    id: 'replikasi_kolaborasi',
    name: 'Replikasi dan Kolaborasi',
    weight: 10,
    description: 'Potensi diterapkan di unit/daerah lain serta pelibatan pemangku kepentingan (kolaborasi pentahelix).'
  },
  {
    id: 'unsur_penyaji',
    name: 'Unsur Penyaji',
    weight: 10,
    description: 'Penguasaan materi presentasi, sistematika penyampaian, dan ketepatan menjawab pertanyaan dewan juri.'
  }
];

export const KRENOVA_PELAJAR_CRITERIA: Criterion[] = [
  {
    id: 'orisinalitas',
    name: 'Orisinalitas / Kepioniran',
    weight: 20,
    subCriteria: [
      { id: 'kp_baru', name: 'Temuan Baru', description: 'Gagasan atau produk murni ciptaan orisinal siswa' },
      { id: 'kp_kembang', name: 'Pengembangan Ide', description: 'Tingkat modifikasi dan peningkatan nilai guna dari ide dasar' }
    ]
  },
  {
    id: 'manfaat',
    name: 'Manfaat',
    weight: 25,
    subCriteria: [
      { id: 'kp_bahan_lokal', name: 'Penyerapan Bahan Baku Lokal', description: 'Pemanfaatan potensi bahan lokal Wonogiri/sekitarnya' },
      { id: 'kp_proses_produksi', name: 'Peningkatan Proses Produksi', description: 'Efisiensi, kualitas, atau kemudahan proses pembuatan' }
    ]
  },
  {
    id: 'penerapan',
    name: 'Penerapan di Masyarakat',
    weight: 20,
    subCriteria: [
      { id: 'kp_skala_terbatas', name: 'Dipakai dalam Skala Terbatas (Kab/Kota)', description: 'Tingkat adopsi lokal di lingkungan sekolah/lingkungan sekitar' },
      { id: 'kp_skala_luas', name: 'Dipakai dalam Skala Luas (Prov/Nasional/Internasional)', description: 'Potensi adopsi regional dan nasional' }
    ]
  },
  {
    id: 'keberlangsungan',
    name: 'Keberlangsungan',
    weight: 20,
    subCriteria: [
      { id: 'kp_prospek', name: 'Prospek Pengembangan', description: 'Rencana keberlanjutan dan komersialisasi masa depan' },
      { id: 'kp_bahan_baku', name: 'Kemelimpahan Bahan Baku', description: 'Ketersediaan bahan baku dalam jangka panjang' },
      { id: 'kp_orientasi_masa_depan', name: 'Berorientasi Kebutuhan Masa Depan', description: 'Dukungan terhadap isu lingkungan, pangan, atau teknologi hijau' }
    ]
  },
  {
    id: 'penyaji',
    name: 'Penyaji',
    weight: 15,
    subCriteria: [
      { id: 'kp_penguasaan', name: 'Penguasaan Materi', description: 'Pemahaman mendalam mengenai produk dan proses' },
      { id: 'kp_jawaban', name: 'Kemampuan Menjawab Pertanyaan', description: 'Ketangkasan dan kelugasan dalam merespon juri' }
    ]
  }
];

export const KRENOVA_MASYARAKAT_CRITERIA: Criterion[] = [
  {
    id: 'orisinalitas',
    name: 'Orisinalitas / Kepioniran',
    weight: 15,
    subCriteria: [
      { id: 'km_baru', name: 'Temuan Baru', description: 'Gagasan atau produk orisinal dari inovator masyarakat' },
      { id: 'km_kembang', name: 'Pengembangan Ide', description: 'Inovasi nilai tambah dari teknologi atau produk konvensional' }
    ]
  },
  {
    id: 'manfaat',
    name: 'Manfaat',
    weight: 25,
    subCriteria: [
      { id: 'km_bahan_lokal', name: 'Penyerapan Bahan Baku Lokal', description: 'Memaksimalkan komoditas dan potensi khas daerah' },
      { id: 'km_proses_produksi', name: 'Peningkatan Proses Produksi', description: 'Dampak nyata pada efisiensi ekonomi dan produktivitas' }
    ]
  },
  {
    id: 'penerapan',
    name: 'Penerapan di Masyarakat',
    weight: 25,
    subCriteria: [
      { id: 'km_skala_terbatas', name: 'Dipakai dalam Skala Terbatas (Kab/Kota)', description: 'Telah teruji dan dimanfaatkan masyarakat Wonogiri' },
      { id: 'km_skala_luas', name: 'Dipakai dalam Skala Luas (Prov/Nasional/Internasional)', description: 'Peluang ekspansi pasar dan kemanfaatan lebih luas' }
    ]
  },
  {
    id: 'keberlangsungan',
    name: 'Keberlangsungan',
    weight: 20,
    subCriteria: [
      { id: 'km_prospek', name: 'Prospek Pengembangan', description: 'Kesiapan bisnis, legalitas, dan peta jalan inovasi' },
      { id: 'km_bahan_baku', name: 'Kemelimpahan Bahan Baku', description: 'Kepastian pasokan bahan baku yang berkelanjutan' },
      { id: 'km_orientasi_masa_depan', name: 'Berorientasi Kebutuhan Masa Depan', description: 'Solusi relevan untuk kebutuhan sosial, ekonomi, & lingkungan' }
    ]
  },
  {
    id: 'penyaji',
    name: 'Penyaji',
    weight: 15,
    subCriteria: [
      { id: 'km_pemahaman', name: 'Pemahaman Materi', description: 'Kedalaman teknis dan wawasan penyaji' },
      { id: 'km_ketepatan_waktu', name: 'Ketepatan Waktu', description: 'Kedisiplinan dalam durasi paparan presentasi' },
      { id: 'km_kelancaran_jawaban', name: 'Kelancaran Menjawab Pertanyaan', description: 'Kejelasan argumentasi saat sesi tanya jawab' }
    ]
  }
];

export const INITIAL_JUDGES: Judge[] = [
  // TIM JURI 1 - Ruang Graha Perencana 3 (OPD, Kecamatan, BUMD)
  {
    id: 'juri-1-1',
    name: 'FX. Pranata, A.P., M.Hum.',
    role: 'Sekretaris Daerah Kabupaten Wonogiri',
    institution: 'Pemerintah Kabupaten Wonogiri',
    teamId: 1,
    room: 'Ruang Graha Perencana 3 BAPPERIDA',
    assignedCategories: ['opd', 'kecamatan', 'bumd'],
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'juri-1-2',
    name: 'Prof. Dr. Hesti Sadyadi, S.E., M.Si.',
    role: 'Guru Besar',
    institution: 'Sekolah Tinggi Agama Buddha Negeri Wonogiri',
    teamId: 1,
    room: 'Ruang Graha Perencana 3 BAPPERIDA',
    assignedCategories: ['opd', 'kecamatan', 'bumd'],
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'juri-1-3',
    name: 'Mokhamad Diky Praditia, S.S.',
    role: 'Jurnalis / Reporter',
    institution: 'Solopos',
    teamId: 1,
    room: 'Ruang Graha Perencana 3 BAPPERIDA',
    assignedCategories: ['opd', 'kecamatan', 'bumd'],
    avatarColor: 'bg-sky-600'
  },

  // TIM JURI 2 - Ruang Graha Perencana 2 (Puskesmas, Pelajar WIA, Korwil Bidang Pendidikan)
  {
    id: 'juri-2-1',
    name: 'Prof. Dr. Chatarina Muryani, M.Si.',
    role: 'Dosen Guru Besar',
    institution: 'Universitas Sebelas Maret Surakarta (UNS)',
    teamId: 2,
    room: 'Ruang Graha Perencana 2 BAPPERIDA',
    assignedCategories: ['korwilcambidik', 'puskesmas', 'pelajar'],
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'juri-2-2',
    name: 'Purwadi, S.E., M.E.',
    role: 'Kepala BAPPERIDA',
    institution: 'BAPPERIDA Kabupaten Wonogiri',
    teamId: 2,
    room: 'Ruang Graha Perencana 2 BAPPERIDA',
    assignedCategories: ['korwilcambidik', 'puskesmas', 'pelajar'],
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'juri-2-3',
    name: 'Sunan Fanijie, S.E.',
    role: 'Praktisi & Pengusaha',
    institution: 'HIPMI Wonogiri',
    teamId: 2,
    room: 'Ruang Graha Perencana 2 BAPPERIDA',
    assignedCategories: ['korwilcambidik', 'puskesmas', 'pelajar'],
    avatarColor: 'bg-green-600'
  },

  // TIM JURI 3 - Ruang Graha Perencana 1 (Desa/Kelurahan, Krenova Pelajar, Krenova Masyarakat)
  {
    id: 'juri-3-1',
    name: 'Wijiyanto, S.T., M.Eng.Sc.',
    role: 'Dosen Teknik',
    institution: 'Universitas Muhammadiyah Surakarta (UMS)',
    teamId: 3,
    room: 'Ruang Graha Perencana 1 BAPPERIDA',
    assignedCategories: ['desa', 'pelajar', 'masyarakat'],
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'juri-3-2',
    name: 'Dr. Widia Darma, M.Pd.',
    role: 'Dosen',
    institution: 'Sekolah Tinggi Agama Buddha Negeri Wonogiri',
    teamId: 3,
    room: 'Ruang Graha Perencana 1 BAPPERIDA',
    assignedCategories: ['desa', 'pelajar', 'masyarakat'],
    avatarColor: 'bg-orange-600'
  },
  {
    id: 'juri-3-3',
    name: 'Sony Suharsono, S.Si.',
    role: 'Program Fasilitator',
    institution: 'Djarum Foundation',
    teamId: 3,
    room: 'Ruang Graha Perencana 1 BAPPERIDA',
    assignedCategories: ['desa', 'pelajar', 'masyarakat'],
    avatarColor: 'bg-rose-600'
  }
];

export const INITIAL_NOMINATORS: Nominator[] = [
  // ==========================================
  // TIM 1 (Ruang Graha Perencana 3) - WIA OPD, KECAMATAN, BUMD
  // ==========================================
  // WIA - OPD
  {
    id: 'wia-opd-1',
    competition: 'WIA',
    category: 'opd',
    categoryLabel: 'Perangkat Daerah (OPD)',
    orderNumber: 1,
    name: 'Dinas Sosial Kabupaten Wonogiri',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '08.00 - 08.15',
    scheduleOrder: 1
  },
  {
    id: 'wia-opd-2',
    competition: 'WIA',
    category: 'opd',
    categoryLabel: 'Perangkat Daerah (OPD)',
    orderNumber: 2,
    name: 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kabupaten Wonogiri',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '08.15 - 08.30',
    scheduleOrder: 2
  },
  {
    id: 'wia-opd-3',
    competition: 'WIA',
    category: 'opd',
    categoryLabel: 'Perangkat Daerah (OPD)',
    orderNumber: 3,
    name: 'Dinas Kearsipan dan Perpustakaan Kabupaten Wonogiri',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '08.30 - 08.45',
    scheduleOrder: 3
  },
  {
    id: 'wia-opd-4',
    competition: 'WIA',
    category: 'opd',
    categoryLabel: 'Perangkat Daerah (OPD)',
    orderNumber: 4,
    name: 'Badan Penanggulangan Bencana Daerah (BPBD) Kabupaten Wonogiri',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '09.00 - 09.15',
    scheduleOrder: 4
  },
  {
    id: 'wia-opd-5',
    competition: 'WIA',
    category: 'opd',
    categoryLabel: 'Perangkat Daerah (OPD)',
    orderNumber: 5,
    name: 'Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM) Kab. Wonogiri',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '09.15 - 09.30',
    scheduleOrder: 5
  },

  // WIA - Kecamatan
  {
    id: 'wia-kec-1',
    competition: 'WIA',
    category: 'kecamatan',
    categoryLabel: 'Kecamatan',
    orderNumber: 1,
    name: 'Kecamatan Girimarto',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '09.30 - 09.45',
    scheduleOrder: 6
  },
  {
    id: 'wia-kec-2',
    competition: 'WIA',
    category: 'kecamatan',
    categoryLabel: 'Kecamatan',
    orderNumber: 2,
    name: 'Kecamatan Batuwarno',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '09.45 - 10.00',
    scheduleOrder: 7
  },
  {
    id: 'wia-kec-3',
    competition: 'WIA',
    category: 'kecamatan',
    categoryLabel: 'Kecamatan',
    orderNumber: 3,
    name: 'Kecamatan Nguntoronadi',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '10.00 - 10.15',
    scheduleOrder: 8
  },
  {
    id: 'wia-kec-4',
    competition: 'WIA',
    category: 'kecamatan',
    categoryLabel: 'Kecamatan',
    orderNumber: 4,
    name: 'Kecamatan Tirtomoyo',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '10.15 - 10.30',
    scheduleOrder: 9
  },
  {
    id: 'wia-kec-5',
    competition: 'WIA',
    category: 'kecamatan',
    categoryLabel: 'Kecamatan',
    orderNumber: 5,
    name: 'Kecamatan Manyaran',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '10.30 - 10.45',
    scheduleOrder: 10
  },

  // WIA - BUMD
  {
    id: 'wia-bum-1',
    competition: 'WIA',
    category: 'bumd',
    categoryLabel: 'BUMD',
    orderNumber: 1,
    name: 'PT. BPR Bank Wonogiri (Perseroda)',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '10.45 - 11.00',
    scheduleOrder: 11
  },
  {
    id: 'wia-bum-2',
    competition: 'WIA',
    category: 'bumd',
    categoryLabel: 'BUMD',
    orderNumber: 2,
    name: 'PT. BPR BKK Wonogiri (Perseroda)',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '11.00 - 11.15',
    scheduleOrder: 12
  },
  {
    id: 'wia-bum-3',
    competition: 'WIA',
    category: 'bumd',
    categoryLabel: 'BUMD',
    orderNumber: 3,
    name: 'Perumda Air Minum Giri Tirta Sari',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '11.15 - 11.30',
    scheduleOrder: 13
  },
  {
    id: 'wia-bum-4',
    competition: 'WIA',
    category: 'bumd',
    categoryLabel: 'BUMD',
    orderNumber: 4,
    name: 'PT. Giri Aneka Usaha (Perseroda)',
    room: 'Ruang Graha Perencana 3',
    teamId: 1,
    timeSlot: '11.30 - 11.45',
    scheduleOrder: 14
  },

  // ==========================================
  // TIM 2 (Ruang Graha Perencana 2) - KORWIL, PUSKESMAS, SMP (WIA)
  // ==========================================
  // WIA - Korwilcambidik
  {
    id: 'wia-kor-1',
    competition: 'WIA',
    category: 'korwilcambidik',
    categoryLabel: 'Korwil Bidang Pendidikan',
    orderNumber: 1,
    name: 'Korwilcambidik Wuryantoro',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '08.00 - 08.15',
    scheduleOrder: 1
  },
  {
    id: 'wia-kor-2',
    competition: 'WIA',
    category: 'korwilcambidik',
    categoryLabel: 'Korwil Bidang Pendidikan',
    orderNumber: 2,
    name: 'Korwilcambidik Baturetno',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '08.15 - 08.30',
    scheduleOrder: 2
  },
  {
    id: 'wia-kor-3',
    competition: 'WIA',
    category: 'korwilcambidik',
    categoryLabel: 'Korwil Bidang Pendidikan',
    orderNumber: 3,
    name: 'Korwilcambidik Jatiroto',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '08.30 - 08.45',
    scheduleOrder: 3
  },
  {
    id: 'wia-kor-4',
    competition: 'WIA',
    category: 'korwilcambidik',
    categoryLabel: 'Korwil Bidang Pendidikan',
    orderNumber: 4,
    name: 'Korwilcambidik Wonogiri',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '09.00 - 09.15',
    scheduleOrder: 4
  },
  {
    id: 'wia-kor-5',
    competition: 'WIA',
    category: 'korwilcambidik',
    categoryLabel: 'Korwil Bidang Pendidikan',
    orderNumber: 5,
    name: 'Korwilcambidik Slogohimo',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '09.15 - 09.30',
    scheduleOrder: 5
  },

  // WIA - Puskesmas
  {
    id: 'wia-pus-1',
    competition: 'WIA',
    category: 'puskesmas',
    categoryLabel: 'Puskesmas',
    orderNumber: 1,
    name: 'Puskesmas Sidoharjo',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '09.30 - 09.45',
    scheduleOrder: 6
  },
  {
    id: 'wia-pus-2',
    competition: 'WIA',
    category: 'puskesmas',
    categoryLabel: 'Puskesmas',
    orderNumber: 2,
    name: 'Puskesmas Pracimantoro I',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '09.45 - 10.00',
    scheduleOrder: 7
  },
  {
    id: 'wia-pus-3',
    competition: 'WIA',
    category: 'puskesmas',
    categoryLabel: 'Puskesmas',
    orderNumber: 3,
    name: 'Puskesmas Wonogiri I',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '10.00 - 10.15',
    scheduleOrder: 8
  },
  {
    id: 'wia-pus-4',
    competition: 'WIA',
    category: 'puskesmas',
    categoryLabel: 'Puskesmas',
    orderNumber: 4,
    name: 'Puskesmas Jatisrono I',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '10.15 - 10.30',
    scheduleOrder: 9
  },
  {
    id: 'wia-pus-5',
    competition: 'WIA',
    category: 'puskesmas',
    categoryLabel: 'Puskesmas',
    orderNumber: 5,
    name: 'Puskesmas Jatipurno',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '10.30 - 10.45',
    scheduleOrder: 10
  },

  // WIA - Pelajar / SMP
  {
    id: 'wia-sch-1',
    competition: 'WIA',
    category: 'pelajar',
    categoryLabel: 'Pelajar / SMP',
    orderNumber: 1,
    name: 'SMP N 1 Ngadirojo',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '10.45 - 11.00',
    scheduleOrder: 11
  },
  {
    id: 'wia-sch-2',
    competition: 'WIA',
    category: 'pelajar',
    categoryLabel: 'Pelajar / SMP',
    orderNumber: 2,
    name: 'SMP N 5 Wonogiri',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '11.00 - 11.15',
    scheduleOrder: 12
  },
  {
    id: 'wia-sch-3',
    competition: 'WIA',
    category: 'pelajar',
    categoryLabel: 'Pelajar / SMP',
    orderNumber: 3,
    name: 'SMP N 1 Baturetno',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '11.15 - 11.30',
    scheduleOrder: 13
  },
  {
    id: 'wia-sch-4',
    competition: 'WIA',
    category: 'pelajar',
    categoryLabel: 'Pelajar / SMP',
    orderNumber: 4,
    name: 'SMP N 2 Girimarto',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '11.30 - 11.45',
    scheduleOrder: 14
  },
  {
    id: 'wia-sch-5',
    competition: 'WIA',
    category: 'pelajar',
    categoryLabel: 'Pelajar / SMP',
    orderNumber: 5,
    name: 'SMP N 1 Selogiri',
    room: 'Ruang Graha Perencana 2',
    teamId: 2,
    timeSlot: '11.45 - 12.00',
    scheduleOrder: 15
  },

  // ==========================================
  // TIM 3 (Ruang Graha Perencana 1) - KRENOVA PELAJAR, KRENOVA MASYARAKAT, DESA/KELURAHAN
  // ==========================================
  // Krenova Pelajar
  {
    id: 'krenova-pelajar-1',
    competition: 'KRENOVA',
    category: 'pelajar',
    categoryLabel: 'Krenova Tingkat Pelajar',
    orderNumber: 1,
    title: 'MIELOVA LOKANILLA',
    description: 'Inovasi Olahan Pangan Mie Bakso Berbasis Ikan Nila dan Tepung Gaplek untuk Mewujudkan Pangan Lokal yang Inovatif dan Bernilai Tambah',
    name: 'WINDA OKTAVI NAILATUL IZZAH',
    institution: 'SMA 2 Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '08.00 - 08.15',
    scheduleOrder: 1
  },
  {
    id: 'krenova-pelajar-2',
    competition: 'KRENOVA',
    category: 'pelajar',
    categoryLabel: 'Krenova Tingkat Pelajar',
    orderNumber: 2,
    title: 'BIO-SEKATER Adipura',
    description: 'Inovasi Material Sintensis Green Composite Berbasis Silika Sekam Padi Limbah Agro-Industri Jawa Tengah dan Aplikasi Kalsium Residu Cangkang Telur Program MBG Guna Mewujudkan Paving Block Berdaya Serap Tinggi',
    name: 'Syawalia Nur Azahro',
    institution: 'SMA 1 Purwantoro',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '08.15 - 08.30',
    scheduleOrder: 2
  },
  {
    id: 'krenova-pelajar-3',
    competition: 'KRENOVA',
    category: 'pelajar',
    categoryLabel: 'Krenova Tingkat Pelajar',
    orderNumber: 3,
    title: 'Muda Pet Care',
    description: 'Pemanfaatan Bio-Enzim dari Limbah MBG sebagai Bahan Dasar Pembuatan Shampo Hewan Ramah Lingkungan',
    name: 'Salsabila Hariyanto',
    institution: 'SMK Muhammadiyah 2 Wuryantoro',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '08.30 - 08.45',
    scheduleOrder: 3
  },
  {
    id: 'krenova-pelajar-4',
    competition: 'KRENOVA',
    category: 'pelajar',
    categoryLabel: 'Krenova Tingkat Pelajar',
    orderNumber: 4,
    title: 'Chocovation',
    description: 'Inovasi Pengolahan Cokelat Lokal Berbasis Potensi Kakao Wonogiri',
    name: 'WAHYU IKA RAMADANI',
    institution: 'SMA N 1 Baturetno',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '09.00 - 09.15',
    scheduleOrder: 4
  },
  {
    id: 'krenova-pelajar-5',
    competition: 'KRENOVA',
    category: 'pelajar',
    categoryLabel: 'Krenova Tingkat Pelajar',
    orderNumber: 5,
    title: 'Body Scrub dari Biji Alpukat dan Cangkang Telur',
    description: 'Pemanfaatan Biji Alpukat dan Residu Cangkang Telur Alami',
    name: 'Keyla Enggar Pramulya',
    institution: 'SMA 1 Slogohimo',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '09.15 - 09.30',
    scheduleOrder: 5
  },

  // Krenova Masyarakat
  {
    id: 'krenova-masyarakat-1',
    competition: 'KRENOVA',
    category: 'masyarakat',
    categoryLabel: 'Krenova Tingkat Masyarakat',
    orderNumber: 1,
    title: 'Sapu Bersih bersama Saku',
    description: 'Gerakan Inovatif Pengelolaan Sampah dan Lingkungan Berbasis Komunitas Saku',
    name: 'Riyanto',
    teamMembers: ['Tanti Purwaningrum', 'Titik Ismulyanti', 'Irfan Mahmud Mustofa', 'Fahmi Fitrotul Ummah'],
    institution: 'Masyarakat Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '09.30 - 09.45',
    scheduleOrder: 6
  },
  {
    id: 'krenova-masyarakat-2',
    competition: 'KRENOVA',
    category: 'masyarakat',
    categoryLabel: 'Krenova Tingkat Masyarakat',
    orderNumber: 2,
    title: 'Aplikasi Motor Listrik Bertenaga Baterai Pada Mesin Mixer Adonan Makanan Hemat Energi',
    description: 'Konversi dan rekayasa mesin mixer makanan berbasis tenaga motor listrik baterai hemat energi',
    name: 'Adzin Kondo Nurbuwat',
    institution: 'Masyarakat Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '09.45 - 10.00',
    scheduleOrder: 7
  },
  {
    id: 'krenova-masyarakat-3',
    competition: 'KRENOVA',
    category: 'masyarakat',
    categoryLabel: 'Krenova Tingkat Masyarakat',
    orderNumber: 3,
    title: 'KAWAN MARTO : Kakao Menawan Girimarto',
    description: 'Inovasi hilirisasi kakao lokal menjadi produk bernilai ekonomi tinggi di Girimarto',
    name: 'Hariyanto',
    institution: 'Girimarto, Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '10.00 - 10.15',
    scheduleOrder: 8
  },
  {
    id: 'krenova-masyarakat-4',
    competition: 'KRENOVA',
    category: 'masyarakat',
    categoryLabel: 'Krenova Tingkat Masyarakat',
    orderNumber: 4,
    title: 'Cakrawayang : Platform XR (VR dan MR) Imersif untuk Simulasi Interaktif Pagelaran Wayang Kulit dan Gamelan',
    description: 'Inovasi Pelestarian Budaya Nusantara dan Penguatan Ekonomi Kreatif Pengrajin Wayang Kulit dan Gamelan Lokal',
    name: 'Musfiq Amrulloh, S.Pd.',
    teamMembers: ['Lathifah Safiinatun Najaah, M.Pd.'],
    institution: 'Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '10.15 - 10.30',
    scheduleOrder: 9
  },
  {
    id: 'krenova-masyarakat-5',
    competition: 'KRENOVA',
    category: 'masyarakat',
    categoryLabel: 'Krenova Tingkat Masyarakat',
    orderNumber: 5,
    title: 'SEMAR MESEM WEBSITE',
    description: 'Sistem Informasi dan Pelayanan Digital Terpadu Berbasis Web',
    name: 'Eva Marlina',
    teamMembers: ['Endang Widati', 'Yopi Harminto', 'Triyono'],
    institution: 'Wonogiri',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '10.30 - 10.45',
    scheduleOrder: 10
  },

  // WIA - Desa / Kelurahan
  {
    id: 'wia-des-1',
    competition: 'WIA',
    category: 'desa',
    categoryLabel: 'Desa / Kelurahan',
    orderNumber: 1,
    name: 'Desa Gemawang',
    institution: 'Kecamatan Girimarto',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '10.45 - 11.00',
    scheduleOrder: 11
  },
  {
    id: 'wia-des-2',
    competition: 'WIA',
    category: 'desa',
    categoryLabel: 'Desa / Kelurahan',
    orderNumber: 2,
    name: 'Desa Kulurejo',
    institution: 'Kecamatan Nguntoronadi',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '11.00 - 11.15',
    scheduleOrder: 12
  },
  {
    id: 'wia-des-3',
    competition: 'WIA',
    category: 'desa',
    categoryLabel: 'Desa / Kelurahan',
    orderNumber: 3,
    name: 'Desa Slogoretno',
    institution: 'Kecamatan Jatipurno',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '11.15 - 11.30',
    scheduleOrder: 13
  },
  {
    id: 'wia-des-4',
    competition: 'WIA',
    category: 'desa',
    categoryLabel: 'Desa / Kelurahan',
    orderNumber: 4,
    name: 'Desa Selorejo',
    institution: 'Kecamatan Girimarto',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '11.30 - 11.45',
    scheduleOrder: 14
  },
  {
    id: 'wia-des-5',
    competition: 'WIA',
    category: 'desa',
    categoryLabel: 'Desa / Kelurahan',
    orderNumber: 5,
    name: 'Desa Gebang',
    institution: 'Kecamatan Nguntoronadi',
    room: 'Ruang Graha Perencana 1',
    teamId: 3,
    timeSlot: '11.45 - 12.00',
    scheduleOrder: 15
  }
];
