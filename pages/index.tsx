import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import DayGrid from '@/components/DayGrid';
import Toast from '@/components/Toast';
import type { Masters } from '@/lib/types';
import { APP_TITLE, GAS_ENDPOINT } from '@/lib/config';
import { FALLBACK_ORIGINS, FALLBACK_STAFF } from '@/lib/mastersFallback';

function fmtYymm(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function Home() {
  const [masters, setMasters] = useState<Masters>({ staff: [], origins: [] });
  const [loadingMasters, setLoadingMasters] = useState(true);

  const today = new Date();
  const [month, setMonth] = useState<string>(fmtYymm(today));
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('自宅');
  const [useCustomOrigin, setUseCustomOrigin] = useState(false);
  const [destination, setDestination] = useState('吉祥寺');
  const [exception, setException] = useState(false);
  const [transport, setTransport] = useState<'電車' | 'バス'>('電車');
  const [fare, setFare] = useState<number>(180);
  const [days, setDays] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (GAS_ENDPOINT) {
        try {
          const r = await fetch(`${GAS_ENDPOINT}?resource=masters`);
          if (r.ok) {
            const data = (await r.json()) as Masters;
            if (!ignore && Array.isArray(data.staff) && Array.isArray(data.origins)) {
              setMasters(data);
              setName((prev) => prev || data.staff[0] || '');
              setLoadingMasters(false);
              return;
            }
          }
        } catch {}
      }
      if (!ignore) {
        const fb = { staff: FALLBACK_STAFF, origins: FALLBACK_ORIGINS };
        setMasters(fb);
        setName((prev) => prev || fb.staff[0] || '');
        setLoadingMasters(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const [yearNum, monthNum] = useMemo(() => {
    const [y, m] = month.split('-').map((n) => parseInt(n, 10));
    return [y, m];
  }, [month]);

  useEffect(() => {
    const dim = new Date(yearNum, monthNum, 0).getDate();
    setDays((prev) => prev.filter((d) => d <= dim));
  }, [yearNum, monthNum]);

  const roundtrip = useMemo(() => Math.max(0, (Number.isFinite(fare) ? fare : 0) * 2), [fare]);
  const count = days.length;
  const total = roundtrip * count;
  const route = `${origin}-${destination}`;

  const handleSubmit = async () => {
    if (!name) return setToast({ type: 'error', message: '氏名を選択してください。' });
    if (!month) return setToast({ type: 'error', message: '月を選択してください。' });
    if (!origin) return setToast({ type: 'error', message: '出発地を入力してください。' });
    if (!destination) return setToast({ type: 'error', message: '行き先を入力してください。' });
    if (!fare || fare <= 0) return setToast({ type: 'error', message: '片道運賃を入力してください。' });
    if (days.length === 0) return setToast({ type: 'error', message: '出勤日を選択してください。' });

    setSubmitting(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        month,
        name,
        origin,
        destination,
        route,
        transport,
        oneWayFare: fare,
        roundtripFare: roundtrip,
        daysCsv: days.join(','),
        daysCount: count,
        total,
        note: note || '',
      };

      if (GAS_ENDPOINT) {
        const r = await fetch(GAS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'appendEntry', payload }),
        });
        const data = await r.json();
        if (r.ok && data?.ok) {
          setToast({ type: 'success', message: `${count}日分（${total.toLocaleString()}円）を送信しました！` });
          setDays([]);
        } else {
          throw new Error(data?.error || '送信に失敗しました');
        }
      } else {
        setToast({ type: 'success', message: `${count}日分（${total.toLocaleString()}円）を送信しました！（スタブ）` });
        setDays([]);
      }
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || '送信に失敗しました' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex items-start justify-center p-4 pb-28" style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}>
        <div className="w-full max-w-xl card p-5 md:p-8 mt-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">交通費申請フォーム</h1>

          <div className="mb-4">
            <label className="label">氏名</label>
            <select
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loadingMasters}
            >
              {masters.staff.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="label">月</label>
            <input
              type="month"
              className="input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="label">出発地</label>
            <select
              className="input mb-2"
              value={useCustomOrigin ? '__OTHER__' : origin}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '__OTHER__') {
                  setUseCustomOrigin(true);
                  setOrigin('');
                } else {
                  setUseCustomOrigin(false);
                  setOrigin(v);
                }
              }}
            >
              {masters.origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
              <option value="__OTHER__">その他（手入力）</option>
            </select>
            {useCustomOrigin && (
              <input
                className="input"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="例: 自宅"
              />
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="label">行き先</label>
              <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={exception}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setException(v);
                    if (!v) setDestination('吉祥寺');
                  }}
                />
                例外ルートON
              </label>
            </div>
            <input
              className="input"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={!exception}
            />
          </div>

          <div className="mb-4">
            <label className="label mb-2 block">交通手段</label>
            <div className="grid grid-cols-2 gap-2">
              {(['電車', 'バス'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTransport(m)}
                  className={`rounded-xl px-4 py-3 border font-medium ${
                    transport === m
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                  aria-pressed={transport === m}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="label">片道運賃（円）</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={10}
              className="input"
              value={Number.isFinite(fare) ? fare : 0}
              onChange={(e) => setFare(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label className="label mb-2 block">出勤日</label>
            <DayGrid year={yearNum} month={monthNum} selected={days} onChange={setDays} />
          </div>

          <div className="mb-4">
            <label className="label">備考</label>
            <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="mx-auto max-w-xl px-4 pt-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <div className="flex items-center justify-between mb-3 text-sm text-gray-700">
            <div>選択 {count}日 | 合計 {total.toLocaleString()}円</div>
            <div>往復 {roundtrip.toLocaleString()}円 / {transport}</div>
          </div>
          <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={handleSubmit} disabled={submitting}>
            {submitting && <span className="h-5 w-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
            送信する（{total.toLocaleString()}円）
          </button>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}

