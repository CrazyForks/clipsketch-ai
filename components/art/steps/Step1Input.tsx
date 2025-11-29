
import React, { useState, useEffect } from 'react';
import { ImageViewer } from '../common/ImageViewer';
import { FrameData } from '../../../services/gemini';
import { Film, LayoutGrid, Clock } from 'lucide-react';

interface Step1InputProps {
  isGenerating: boolean;
  frames: FrameData[];
}

export const Step1Input: React.FC<Step1InputProps> = ({ isGenerating, frames }) => {
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    if (frames && frames.length > 0) {
      const img = new Image();
      img.onload = () => {
        setIsVertical(img.height > img.width);
      };
      img.src = frames[0].data;
    }
  }, [frames]);

  if (isGenerating) {
    return (
      <ImageViewer 
        imageSrc={null} 
        isLoading={isGenerating} 
        loadingText="正在分析视频内容..." 
        placeholderText="正在分析..."
      />
    );
  }

  if (frames && frames.length > 0) {
      return (
        <div className="w-full h-full flex flex-col p-1">
          {/* Enhanced Header */}
          <div className="mb-6 shrink-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl border border-slate-800/50 p-6 shadow-xl relative overflow-hidden">
             {/* Decorative Background Element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                           <Film className="w-5 h-5" />
                        </div>
                        关键帧预览 
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {frames.length} frames
                        </span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-lg leading-relaxed">
                        已提取关键帧。AI 将基于这些画面进行创意分析。请确认画面清晰且包含关键步骤。
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                     <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Source Format</span>
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/5 backdrop-blur-sm">
                          <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-xs font-medium text-slate-200">
                              {isVertical ? 'Vertical (9:16)' : 'Horizontal (16:9)'}
                          </span>
                       </div>
                     </div>
                </div>
             </div>
          </div>

          {/* Adaptive Grid */}
          <div className={`grid gap-4 overflow-y-auto custom-scrollbar min-h-0 flex-1 content-start pr-1 pb-4 ${
              isVertical 
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6' 
                : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
          }`}>
             {frames.map((frame, idx) => (
                <div 
                    key={idx} 
                    className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg group hover:border-indigo-500/50 hover:shadow-indigo-500/20 transition-all duration-300 ${
                        isVertical ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                >
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                   
                   <img 
                    src={frame.data} 
                    alt={`Frame ${idx}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                   />
                   
                   {/* Timestamp Badge */}
                   <div className="absolute top-2 left-2 z-20">
                       <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span className="text-[10px] font-mono text-white font-medium tracking-tight">
                            {frame.timestamp ? formatTimestamp(frame.timestamp) : `#${idx+1}`}
                          </span>
                       </div>
                   </div>

                   {/* Frame Number (Visible on hover) */}
                   <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-[10px] font-bold text-white/50 bg-white/10 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                   </div>
                </div>
             ))}
          </div>
        </div>
      );
  }

  return (
    <ImageViewer 
      imageSrc={null} 
      isLoading={false} 
      loadingText="" 
      placeholderText="步骤 1: 分析视频内容并准备绘图"
    />
  );
};

const formatTimestamp = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
};
