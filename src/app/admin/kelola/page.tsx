'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  ArrowLeft, 
  Settings, 
  UserPlus, 
  PlusCircle, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Award
} from 'lucide-react';
import { CompetitionType } from '@/types';

export default function KelolaPage() {
  const { 
    judges, 
    nominators, 
    submissions, 
    addJudge, 
    addNominator, 
    resetData, 
    importData 
  } = useApp();

  // New Judge Form State
  const [judgeName, setJudgeName] = useState('');
  const [judgeRole, setJudgeRole] = useState('');
  const [judgeTeamId, setJudgeTeamId] = useState<number>(1);

  // New Nominator Form State
  const [nomComp, setNomComp] = useState<CompetitionType>('WIA');
  const [nomCategory, setNomCategory] = useState('opd');
  const [nomCategoryLabel, setNomCategoryLabel] = useState('Perangkat Daerah (OPD)');
  const [nomName, setNomName] = useState('');
  const [nomTitle, setNomTitle] = useState('');
  const [nomInstitution, setNomInstitution] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judgeName.trim()) return;

    const room = judgeTeamId === 1 
      ? 'Ruang Graha Perencana 3 BAPPERIDA' 
      : judgeTeamId === 2 
      ? 'Ruang Graha Perencana 2 BAPPERIDA' 
      : 'Ruang Graha Perencana 1 BAPPERIDA';

    const assignedCategories = judgeTeamId === 1 
      ? ['opd', 'kecamatan', 'bumd']
      : judgeTeamId === 2 
      ? ['korwilcambidik', 'puskesmas', 'pelajar']
      : ['desa', 'pelajar', 'masyarakat'];

    await addJudge({
      name: judgeName.trim(),
      role: judgeRole.trim() || 'Dewan Juri',
      teamId: judgeTeamId,
      room,
      assignedCategories,
      avatarColor: 'bg-blue-600'
    });

    setJudgeName('');
    setJudgeRole('');
    setMessage({ type: 'success', text: 'Dewan Juri berhasil ditambahkan!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddNominator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomName.trim()) return;

    const teamId = nomCategory === 'opd' || nomCategory === 'kecamatan' || nomCategory === 'bumd' 
      ? 1 
      : nomCategory === 'korwilcambidik' || nomCategory === 'puskesmas' || (nomComp === 'WIA' && nomCategory === 'pelajar')
      ? 2 
      : 3;

    const room = teamId === 1 
      ? 'Ruang Graha Perencana 3' 
      : teamId === 2 
      ? 'Ruang Graha Perencana 2' 
      : 'Ruang Graha Perencana 1';

    await addNominator({
      competition: nomComp,
      category: nomCategory,
      categoryLabel: nomCategoryLabel,
      name: nomName.trim(),
      title: nomTitle.trim() || undefined,
      institution: nomInstitution.trim() || undefined,
      room,
      teamId,
      timeSlot: '11.45 - 12.00',
      scheduleOrder: nominators.length + 1
    });

    setNomName('');
    setNomTitle('');
    setNomInstitution('');
    setMessage({ type: 'success', text: 'Nominator baru berhasil ditambahkan!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      judges,
      nominators,
      submissions,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Penjurian_WIA_Krenova_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.judges && parsed.nominators) {
          const success = await importData(parsed);
          if (success) {
            setMessage({ type: 'success', text: 'Data cadangan berhasil diimpor & disinkronkan!' });
          } else {
            setMessage({ type: 'error', text: 'Gagal mengimpor file.' });
          }
        } else {
          setMessage({ type: 'error', text: 'Format file cadangan tidak valid.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal memproses file JSON.' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data penilaian kembali ke daftar awal? Seluruh nilai yang dimasukkan akan dikosongkan.')) {
      await resetData();
      setMessage({ type: 'success', text: 'Sistem berhasil direset ke pengaturan awal (9 Dewan Juri & 3 Ruangan).' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Admin</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Data & Cadangan Sistem</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen Dewan Juri, Nominator, serta Backup dan Restore Data Penjurian WIA & Krenova 2026
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Backup and Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Cadangkan Data (Backup)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Unduh seluruh berkas nilai, juri, dan peserta dalam format file JSON agar aman disimpan di flashdisk atau cloud.
            </p>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="mt-4 w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Download Backup JSON
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pulihkan Data (Restore)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Unggah file JSON cadangan untuk memulihkan seluruh data nilai atau memindahkan data antar laptop panitia.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Pilih File Backup
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-rose-900 text-sm">Reset ke Nilai Awal</h3>
            <p className="text-xs text-rose-600/80 mt-1 leading-relaxed">
              Mengembalikan sistem ke data awal (9 Dewan Juri & 3 Ruangan) serta mengosongkan lembar penilaian.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="mt-4 w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Reset Semua Nilai
          </button>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tambah Dewan Juri */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-base">Tambah / Tambah Dewan Juri</h3>
          </div>

          <form onSubmit={handleAddJudge} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                required
                placeholder="Contoh: Dr. Ir. Budi Santoso, M.T."
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Peran / Jabatan</label>
              <input
                type="text"
                placeholder="Contoh: Dosen / Jurnalis / Praktisi"
                value={judgeRole}
                onChange={(e) => setJudgeRole(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Alokasi Ruangan Tim</label>
              <select
                value={judgeTeamId}
                onChange={(e) => setJudgeTeamId(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value={1}>Tim 1 - Ruang Graha Perencana 3 (OPD, Kecamatan, BUMD)</option>
                <option value={2}>Tim 2 - Ruang Graha Perencana 2 (Korwil, Puskesmas, SMP)</option>
                <option value={3}>Tim 3 - Ruang Graha Perencana 1 (Krenova Pelajar, Masyarakat, Desa)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2"
            >
              Simpan Dewan Juri
            </button>
          </form>

          {/* Current Judges List */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Daftar 9 Dewan Juri Terdaftar
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {judges.map((j) => (
                <div key={j.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{j.name}</span>
                    <span className="text-[10px] text-blue-600 block">
                      Tim {j.teamId} • {j.room.split(' ')[2]} {j.room.split(' ')[3]}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{j.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tambah Nominator */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-slate-900 text-base">Tambah Nominator Cadangan</h3>
          </div>

          <form onSubmit={handleAddNominator} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ajang</label>
                <select
                  value={nomComp}
                  onChange={(e) => {
                    const c = e.target.value as CompetitionType;
                    setNomComp(c);
                    if (c === 'WIA') {
                      setNomCategory('opd');
                      setNomCategoryLabel('Perangkat Daerah (OPD)');
                    } else {
                      setNomCategory('pelajar');
                      setNomCategoryLabel('Krenova Tingkat Pelajar');
                    }
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="WIA">WIA 2026</option>
                  <option value="KRENOVA">KRENOVA 2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                <select
                  value={nomCategory}
                  onChange={(e) => {
                    setNomCategory(e.target.value);
                    const opt = e.target.selectedOptions[0];
                    setNomCategoryLabel(opt.text);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {nomComp === 'WIA' ? (
                    <>
                      <option value="opd">Perangkat Daerah (OPD)</option>
                      <option value="kecamatan">Kecamatan</option>
                      <option value="korwilcambidik">Korwil Bidang Pendidikan</option>
                      <option value="pelajar">Pelajar / SMP</option>
                      <option value="puskesmas">Puskesmas</option>
                      <option value="desa">Desa / Kelurahan</option>
                      <option value="bumd">BUMD</option>
                    </>
                  ) : (
                    <>
                      <option value="pelajar">Krenova Tingkat Pelajar</option>
                      <option value="masyarakat">Krenova Tingkat Masyarakat</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {nomComp === 'KRENOVA' ? 'Judul Temuan / Inovasi' : 'Nama Instansi / Nominator'}
              </label>
              <input
                type="text"
                required
                placeholder={nomComp === 'KRENOVA' ? 'Contoh: Mesin Pengering Padi Tenaga Surya' : 'Contoh: Dinas Pertanian Kabupaten Wonogiri'}
                value={nomComp === 'KRENOVA' ? nomTitle : nomName}
                onChange={(e) => nomComp === 'KRENOVA' ? setNomTitle(e.target.value) : setNomName(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {nomComp === 'KRENOVA' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Inovator</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Fauzi dkk"
                  value={nomName}
                  onChange={(e) => setNomName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Asal Lembaga / Sekolah / Wilayah</label>
              <input
                type="text"
                placeholder="Contoh: SMA N 1 Wonogiri / Giriwono"
                value={nomInstitution}
                onChange={(e) => setNomInstitution(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md mt-2"
            >
              Simpan Nominator
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
