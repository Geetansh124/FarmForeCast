import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, MapPin, Upload, X, Square, Plus, Image as ImageIcon, RefreshCw, Aperture } from 'lucide-react';
import { Language } from '../types';

interface InputSectionProps {
  onAnalyze: (inputs: {
    images: string[];
    audio: string | null;
    audioMimeType: string | null;
    useLocation: boolean;
    manualLocation: string;
    language: Language;
  }) => void;
  isAnalyzing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  // Store array of images
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [language, setLanguage] = useState<Language>('English');

  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- Camera Logic ---
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setCameraStream(stream);
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please allow permissions or ensure device has a camera.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    if (showCamera) {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        }).then(stream => {
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }).catch(err => {
            console.error("Failed to switch camera", err);
        });
    }
  }, [facingMode]);

  useEffect(() => {
      if (videoRef.current && cameraStream) {
          videoRef.current.srcObject = cameraStream;
      }
  }, [cameraStream, showCamera]);

  const capturePhoto = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Mirror if user facing
            if (facingMode === 'user') {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            const base64 = dataUrl.split(',')[1];
            
            setImagePreviews(prev => [...prev, dataUrl]);
            setImagesBase64(prev => [...prev, base64]);
            stopCamera();
        }
    }
  };

  // --- Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          setImagePreviews(prev => [...prev, result]);
          setImagesBase64(prev => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImagesBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const mime = result.match(/data:([^;]+);/)?.[1] || 'audio/wav';
        const base64 = result.split(',')[1];
        setAudioBase64(base64);
        setAudioMimeType(mime);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          setAudioBase64(base64);
          setAudioMimeType(mimeType);
          setAudioName("Microphone Recording");
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearAudio = () => {
    setAudioName(null);
    setAudioBase64(null);
    setAudioMimeType(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleSubmit = () => {
    onAnalyze({ images: imagesBase64, audio: audioBase64, audioMimeType, useLocation, manualLocation, language });
  };

  const hasAnyInput = imagesBase64.length > 0 || useLocation || (manualLocation.trim().length > 0) || audioBase64 !== null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-nature-900 rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-nature-100 dark:border-nature-800 transition-colors">
      
      {/* Camera Modal */}
      {showCamera && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                  
                  <div className="absolute bottom-8 left-0 right-0 flex items-center justify-around px-8">
                      <button onClick={stopCamera} className="p-4 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30">
                          <X size={24} />
                      </button>
                      <button 
                        onClick={capturePhoto} 
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-95 transition-transform"
                      >
                          <div className="w-16 h-16 bg-white rounded-full"></div>
                      </button>
                      <button onClick={switchCamera} className="p-4 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30">
                          <RefreshCw size={24} />
                      </button>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-nature-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
            <Camera className="w-5 h-5 text-nature-500" />
            Visual Diagnosis
          </label>
          
          <div className="space-y-3">
             <div className="flex gap-2">
                 <button 
                    onClick={startCamera}
                    className="flex-1 py-6 rounded-2xl border border-dashed border-nature-300 dark:border-nature-600 bg-nature-50 dark:bg-nature-800/50 flex flex-col items-center justify-center hover:bg-nature-100 dark:hover:bg-nature-800 transition-colors group"
                 >
                    <Aperture className="w-8 h-8 text-nature-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-nature-700 dark:text-nature-300">Open Camera</span>
                 </button>
                 <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="flex-1 py-6 rounded-2xl border border-dashed border-nature-300 dark:border-nature-600 bg-nature-50 dark:bg-nature-800/50 flex flex-col items-center justify-center hover:bg-nature-100 dark:hover:bg-nature-800 transition-colors group"
                 >
                    <Upload className="w-8 h-8 text-nature-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-nature-700 dark:text-nature-300">Upload Photos</span>
                 </button>
             </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={src} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-xl border border-nature-200 dark:border-nature-700" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            <input 
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              multiple
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <label className="block text-nature-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
              <Mic className="w-5 h-5 text-nature-500" />
              Audio Input (Optional)
            </label>
            
            <div className="flex flex-col gap-3">
              {audioBase64 ? (
                <div className="flex items-center gap-3 p-3 bg-nature-50 dark:bg-nature-800 border border-nature-200 dark:border-nature-700 rounded-xl">
                    <Mic className="w-5 h-5 text-nature-500" />
                    <span className="flex-1 text-sm text-nature-700 dark:text-nature-200 font-medium truncate">{audioName}</span>
                    <button onClick={clearAudio} className="text-red-400 hover:text-red-500 p-1"><X size={18} /></button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={isRecording ? stopRecording : startRecording} className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm font-medium ${isRecording ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse' : 'bg-nature-50 border-nature-200 dark:bg-nature-800 dark:border-nature-700 text-nature-700 dark:text-nature-200 hover:bg-nature-100 dark:hover:bg-nature-700'}`}>
                    {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
                    {isRecording ? "Stop" : "Record"}
                  </button>
                  <button onClick={() => audioInputRef.current?.click()} className="flex-1 py-3 px-4 rounded-xl border border-nature-200 dark:border-nature-700 bg-white dark:bg-nature-900 text-nature-600 dark:text-nature-300 hover:bg-gray-50 dark:hover:bg-nature-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Upload size={18} /> Upload
                  </button>
                </div>
              )}
              <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
            </div>
          </div>

          <div>
            <label className="block text-nature-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-nature-500" />
              Local Sensors
            </label>
            <div className="space-y-3">
              <button onClick={() => { const newState = !useLocation; setUseLocation(newState); if (newState) setManualLocation(''); }} className={`w-full py-3 px-4 rounded-xl border transition-all flex items-center justify-between ${useLocation ? 'bg-nature-500 border-nature-500 text-white shadow-md' : 'bg-white dark:bg-nature-900 border-nature-200 dark:border-nature-700 text-nature-600 dark:text-nature-300 hover:border-nature-300 dark:hover:border-nature-600'}`}>
                <span className="text-sm font-medium">Use My GPS Location</span>
                <div className={`w-5 h-5 rounded-full border border-current flex items-center justify-center ${useLocation ? 'bg-white text-nature-500' : ''}`}>{useLocation && <div className="w-2.5 h-2.5 rounded-full bg-current" />}</div>
              </button>
              {!useLocation && (
                <div className="relative animate-fade-in">
                  <input type="text" placeholder="Or enter city (e.g. New York, Mumbai)" value={manualLocation} onChange={(e) => setManualLocation(e.target.value)} className="w-full p-3 pl-10 rounded-xl border border-nature-200 dark:border-nature-700 focus:outline-none focus:ring-2 focus:ring-nature-400 text-nature-800 dark:text-white bg-white dark:bg-nature-800 placeholder-nature-400" />
                  <MapPin className="absolute left-3 top-3.5 text-nature-400 w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-nature-900 dark:text-white font-semibold mb-2">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="w-full p-3 rounded-xl border border-nature-200 dark:border-nature-700 bg-white dark:bg-nature-800 text-nature-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-nature-400">
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Russian">Russian (Русский)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button onClick={handleSubmit} disabled={isAnalyzing || isRecording || !hasAnyInput} className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all active:scale-[0.99] ${isAnalyzing || isRecording || !hasAnyInput ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-nature-500 to-nature-600 text-white hover:shadow-nature-200/50 hover:from-nature-400 hover:to-nature-500'}`}>
          {isAnalyzing ? 'Connecting with Nature...' : isRecording ? 'Recording...' : 'Interpret Environment'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;