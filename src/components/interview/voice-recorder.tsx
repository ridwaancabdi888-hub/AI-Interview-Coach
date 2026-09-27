'use client';

import { useEffect, useRef, useState } from 'react';

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function VoiceRecorder({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [transcriptionUnavailable, setTranscriptionUnavailable] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const audioUrlRef = useRef('');
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function releaseStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function stopRecognition() {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;

    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.stop();
    } catch {
      // The browser may already have ended recognition.
    }
  }

  useEffect(() => {
    return () => {
      stopRecognition();

      const recorder = recorderRef.current;
      recorderRef.current = null;
      if (recorder && recorder.state !== 'inactive') {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      }

      releaseStream();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  async function start() {
    if (recording || starting) return;

    setStarting(true);
    setError('');
    setTranscriptionUnavailable(false);

    let stream: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        throw new Error('Audio recording is not supported in this browser.');
      }

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const chunks = chunksRef.current;
        chunksRef.current = [];

        if (chunks.length > 0) {
          const url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = url;
          setAudioUrl(url);
        }

        releaseStream();
        recorderRef.current = null;
        setRecording(false);
      };
      recorder.onerror = () => {
        setError('Recording stopped because the browser reported an audio error.');
        releaseStream();
        recorderRef.current = null;
        setRecording(false);
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);

      const browserWindow = window as typeof window & {
        SpeechRecognition?: new () => RecognitionLike;
        webkitSpeechRecognition?: new () => RecognitionLike;
      };
      const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

      if (!Recognition) {
        setTranscriptionUnavailable(true);
        return;
      }

      try {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
          let text = '';
          for (let index = 0; index < event.results.length; index += 1) {
            text += event.results[index][0].transcript;
          }
          onChange(text.trim());
        };
        recognition.onerror = () => {
          setTranscriptionUnavailable(true);
          recognitionRef.current = null;
        };
        recognition.onend = () => {
          recognitionRef.current = null;
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        setTranscriptionUnavailable(true);
      }
    } catch (caughtError) {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      recorderRef.current = null;
      setRecording(false);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'The microphone could not be started. Check browser permissions and try again.',
      );
    } finally {
      setStarting(false);
    }
  }

  function stop() {
    stopRecognition();

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      releaseStream();
      recorderRef.current = null;
      setRecording(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={recording ? stop : start}
          disabled={starting}
          aria-pressed={recording}
          className={`btn ${recording ? 'bg-red-600 text-white' : 'btn-secondary'} disabled:cursor-wait disabled:opacity-60`}
        >
          {starting ? 'Requesting microphone…' : recording ? '■ Stop recording' : '● Start recording'}
        </button>
        {recording && (
          <span role="status" aria-live="polite" className="text-sm font-semibold text-red-600">
            Recording…
          </span>
        )}
      </div>

      {transcriptionUnavailable && (
        <p role="status" className="mt-3 text-sm text-amber-700">
          Live transcription is unavailable, but audio recording continues. You can type your answer or switch to written mode.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {value && <p className="mt-3 text-xs text-slate-500">Transcript: {value.length} characters</p>}
      {audioUrl && <audio className="mt-4 w-full" controls src={audioUrl} aria-label="Recorded interview answer" />}
    </div>
  );
}
