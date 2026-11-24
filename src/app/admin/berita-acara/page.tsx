'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CompetitionType } from '@/types';
import { ArrowLeft, Printer, Award, FileText, CheckCircle2, Calendar } from 'lucide-react';

export default function BeritaAcaraPage() {
  const { getCategorySummary } = useApp();
  const [selectedComp, setSelectedComp] = useState<CompetitionType>('WIA');
  const [selectedCat, setSelectedCat] = useState<string>('opd');
  const [eventDate, setEventDate] = useState<string>('Rabu, 25 November 2026');

  const summary = getCategorySummary(selectedComp, selectedCat);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
      {/* Top Controls (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Panel Admin</span>
        </Link>

        {/* Category Pickers & Date */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedComp}
            onChange={(e) => {
              const comp = e.target.value as CompetitionType;
              setSelectedComp(comp);
              setSelectedCat(comp === 'WIA' ? 'opd' : 'pelajar');
            }}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="WIA">Wonogiri Innovation Award (WIA)</option>
            <option value="KRENOVA">KRENOVA Kabupaten Wonogiri</option>
          </select>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            {selectedComp === 'WIA' ? (
              <>
                <option value="opd">Perangkat Daerah (OPD) - Tim 1</option>
                <option value="kecamatan">Kecamatan - Tim 1</option>
                <option value="bumd">BUMD - Tim 1</option>
                <option value="korwilcambidik">Korwil Bidang Pendidikan - Tim 2</option>
                <option value="puskesmas">Puskesmas - Tim 2</option>
                <option value="pelajar">Pelajar / SMP - Tim 2</option>
                <option value="desa">Desa / Kelurahan - Tim 3</option>
              </>
            ) : (
              <>
                <option value="pelajar">Kategori Pelajar - Tim 3</option>
                <option value="masyarakat">Kategori Masyarakat - Tim 3</option>
              </>
            )}
          </select>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Tanggal Berita Acara"
              className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:outline-none w-44"
            />
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berita Acara (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Berita Acara Document */}
      <div className="bg-white p-8 sm:p-12 border border-slate-300 rounded-2xl shadow-lg print:border-none print:shadow-none print:p-0 text-slate-900 font-serif">
        {/* Kop Surat Resmi Sesuai Format Standar Pemkab Wonogiri (24.11.2026_08.31.21_REC) */}
        <div className="relative pb-2 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Wonogiri */}
            <div className="shrink-0 w-24 sm:w-28 flex items-center justify-center">
              <img
                src="/logo-wonogiri.png"
                alt="Logo Pemerintah Kabupaten Wonogiri"
                className="w-20 sm:w-24 h-auto object-contain"
              />
            </div>

            {/* Teks Kop Surat */}
            <div className="flex-1 text-center font-sans">
              <h3 className="text-base sm:text-lg font-bold tracking-wider uppercase text-black leading-tight">
                PEMERINTAH KABUPATEN WONOGIRI
              </h3>
              <h2 className="text-lg sm:text-2xl font-black uppercase text-black tracking-wide leading-tight mt-0.5">
                BADAN PERENCANAAN PEMBANGUNAN,
                <br />
                RISET DAN INOVASI DAERAH
              </h2>
              <p className="text-[11px] sm:text-xs text-black mt-1 leading-tight font-medium">
                Jalan Pemuda I Nomor 26, Wonogiri, Jawa Tengah, Kode Pos 57612
              </p>
              <p className="text-[11px] sm:text-xs text-black leading-tight font-medium">
                Telepon (0273)321131 Faksimile (0273) 322102
              </p>
              <p className="text-[11px] sm:text-xs text-black leading-tight font-medium">
                Laman <span className="underline">https://www.bapperida.wonogirikab.go.id</span>, Pos-el bapperida@wonogirikab.go.id
              </p>
            </div>
          </div>

          {/* Garis Ganda Khas Kop Surat Dinas (Garis tebal atas 3px + garis tipis bawah 1px) */}
          <div className="border-b-[3px] border-black mt-3"></div>
          <div className="border-b border-black mt-[2px]"></div>
        </div>

        {/* Judul Berita Acara */}
        <div className="text-center my-6">
          <h1 className="text-base sm:text-lg font-black tracking-wider uppercase underline underline-offset-4">
            BERITA ACARA HASIL PENJURIAN PRESENTASI
          </h1>
          <p className="text-xs sm:text-sm font-bold uppercase mt-1 tracking-wide font-sans">
            {selectedComp === 'WIA' 
              ? `WONOGIRI INNOVATION AWARD (WIA) TAHUN 2026 — KATEGORI ${summary.categoryLabel.toUpperCase()}`
              : `LOMBA KRENOVA KABUPATEN WONOGIRI TAHUN 2026 — KATEGORI ${summary.categoryLabel.toUpperCase()}`
            }
          </p>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Lokasi: {summary.room} | Tim Juri {summary.teamId}
          </p>
        </div>

        {/* Narasi Pembuka */}
        <div className="text-xs sm:text-sm leading-relaxed text-justify space-y-2 font-serif">
          <p>
            Pada hari ini, <strong className="font-bold">{eventDate}</strong>, bertempat di <strong>{summary.room}</strong>, telah diselenggarakan Penjurian Pendalaman Materi / Presentasi Nominator bagi peserta {summary.competition === 'WIA' ? 'Wonogiri Innovation Award' : 'Lomba Krenova'} Tahun 2026 untuk <strong>Kategori {summary.categoryLabel}</strong>.
          </p>
          <p>
            Berdasarkan penilaian objektif oleh segenap Dewan Juri (nilai maksimal satu juri adalah 500 poin), maka dengan ini ditetapkan rekapitulasi nilai akhir dan peringkat juara berdasarkan <strong>Akumulasi Jumlah Poin dari 3 Juri (Maksimal 1.500 Poin)</strong> sebagai berikut:
          </p>
        </div>

        {/* Tabel Rekapitulasi Juara */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-black text-xs font-sans">
            <thead>
              <tr className="bg-slate-100 print:bg-slate-200 text-center font-bold">
                <th className="border border-black p-2 w-12">Rank</th>
                <th className="border border-black p-2 min-w-[200px]">Nominator / Instansi / Inovasi</th>
                <th className="border border-black p-2 min-w-[150px]">Penyaji / Inovator</th>
                {summary.judges.map((j, i) => (
                  <th key={j.id} className="border border-black p-1 w-20">
                    Juri {i + 1}
                    <span className="block text-[9px] font-normal opacity-75">(Maks 500)</span>
                  </th>
                ))}
                <th className="border border-black p-2 w-28">
                  Akumulasi Poin
                  <span className="block text-[9px] font-normal opacity-75">(Maksimal 1.500)</span>
                </th>
                <th className="border border-black p-2 w-28">Penetapan Juara</th>
              </tr>
            </thead>
            <tbody>
              {summary.nominators.map((nom) => {
                const titleOrName = nom.nominator.title ? nom.nominator.title : nom.nominator.name;
                const innovatorOrInst = nom.nominator.title 
                  ? `${nom.nominator.name} (${nom.nominator.institution || ''})`
                  : nom.nominator.institution || nom.nominator.name;
                
                const predikat = nom.rank === 1 
                  ? 'JUARA I' 
                  : nom.rank === 2 
                  ? 'JUARA II' 
                  : nom.rank === 3 
                  ? 'JUARA III' 
                  : nom.rank === 4 
                  ? 'JUARA HARAPAN I' 
                  : nom.rank === 5 
                  ? 'JUARA HARAPAN II' 
                  : `PERINGKAT ${nom.rank}`;

                return (
                  <tr key={nom.nominator.id} className="text-center">
                    <td className="border border-black p-2 font-bold">{nom.rank}</td>
                    <td className="border border-black p-2 text-left font-bold">{titleOrName}</td>
                    <td className="border border-black p-2 text-left">{innovatorOrInst}</td>
                    {summary.judges.map((j) => {
                      const scoreData = nom.judgeScores.find((js) => js.judgeId === j.id);
                      return (
                        <td key={j.id} className="border border-black p-1">
                          {scoreData ? scoreData.totalScore.toFixed(0) : '-'}
                        </td>
                      );
                    })}
                    <td className="border border-black p-2 font-black text-sm bg-slate-50 print:bg-transparent">
                      {nom.totalAccumulatedScore > 0 ? nom.totalAccumulatedScore.toFixed(0) : '-'}
                    </td>
                    <td className="border border-black p-2 font-black uppercase text-xs">
                      {nom.totalAccumulatedScore > 0 ? predikat : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Narasi Penutup */}
        <div className="text-xs sm:text-sm leading-relaxed text-justify mt-4 font-serif">
          <p>
            Demikian Berita Acara ini dibuat dengan sebenarnya dan penuh rasa tanggung jawab untuk dapat dipergunakan sebagaimana mestinya serta menjadi dasar penetapan Keputusan Bupati Wonogiri.
          </p>
        </div>

        {/* Tanda Tangan Dewan Juri Ruangan Terkait & Kepala BAPPERIDA */}
        <div className="mt-8 pt-4">
          <p className="text-xs font-bold text-center font-sans uppercase mb-4 tracking-wider">
            DEWAN JURI PENILAI (TIM JURI {summary.teamId}):
          </p>

          <div className="grid grid-cols-3 gap-6 text-center text-xs font-sans">
            {summary.judges.map((j, i) => (
              <div key={j.id} className="flex flex-col justify-between h-28 border border-dashed border-slate-200 print:border-none p-2 rounded-lg">
                <span className="font-semibold text-slate-500 text-[11px]">
                  Juri {i + 1}
                </span>
                <div className="h-10"></div>
                <div>
                  <p className="font-bold underline text-slate-900">{j.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{j.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mengetahui Kepala BAPPERIDA */}
          <div className="mt-8 pt-4 text-center font-sans text-xs">
            <p className="text-slate-800 font-semibold mb-1">Wonogiri, 25 November 2026</p>
            <p className="font-semibold text-slate-700">Mengetahui,</p>
            <p className="font-bold uppercase text-slate-900 mt-0.5">KEPALA BAPPERIDA KABUPATEN WONOGIRI</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900 text-sm">PURWADI, S.E., M.E.</p>
            <p className="text-slate-600 text-[11px]">Pembina Utama Muda (IV/c)</p>
            <p className="text-slate-500 text-[11px]">NIP. 19720112 199803 1 010</p>
          </div>
        </div>
      </div>
    </div>
  );
}
