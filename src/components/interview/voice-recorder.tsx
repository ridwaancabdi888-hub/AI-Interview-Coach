'use client';

import { useEffect, useRef, useState } from 'react';

type RecognitionLike = { continuous: boolean; interimResults: boolean; lang: string; start: () => void; stop: () => void; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };

export function VoiceRecorder({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [audioUrl, setAudioUrl] = useState('');
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream); chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => { const url = URL.createObjectURL(new Blob(chunksRef.current, { type: recorder.mimeType })); setAudioUrl(url); stream.getTracks().forEach((track) => track.stop()); };
      recorder.start(); recorderRef.current = recorder;
      const W = window as typeof window & { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
      const Recognition = W.SpeechRecognition || W.webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
        recognition.onresult = (event) => { let text = ''; for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript; onChange(text.trim()); };
        recognition.start(); recognitionRef.current = recognition;
      } else setSupported(false);
      setRecording(true);
    } catch { setSupported(false); }
  }
  function stop() { recorderRef.current?.stop(); recognitionRef.current?.stop(); setRecording(false); }

  return <div className="rounded-2xl border bg-slate-50 p-4"><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={recording ? stop : start} className={`btn ${recording ? 'bg-red-600 text-white' : 'btn-secondary'}`}>{recording ? '■ Stop recording' : '● Start recording'}</button>{recording && <span className="text-sm font-semibold text-red-600">Recording…</span>}</div>{!supported && <p className="mt-3 text-sm text-amber-700">Live transcription is unavailable in this browser. You can still type your answer or switch to written mode.</p>}{value && <p className="mt-3 text-xs text-slate-500">Transcript: {value.length} characters</p>}{audioUrl && <audio className="mt-4 w-full" controls src={audioUrl} />}</div>;
}
