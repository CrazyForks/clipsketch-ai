

import React, { useRef } from 'react';
import { 
  Loader2, RefreshCw, ListChecks, 
  Plus, Grid3X3, Check, Copy, Wand2, Sparkles, ChevronDown
} from 'lucide-react';
import { Button } from '../Button';
import { WorkflowStep } from './types';
import { FrameData, CaptionOption, SubPanel } from '../../services/gemini';
import { SocialPlatformStrategy } from '../../services/strategies';

interface SidebarProps {
  viewStep: number;
  onStepChange: (step: number) => void;

  workflowStep: WorkflowStep;
  targetPlatform: SocialPlatformStrategy;
  videoTitle?: string;
  contextDescription: string;
  setContextDescription: (val: string) => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  
  isGeneratingImage: boolean;
  isAnalyzingSteps: boolean;
  
  onAnalyzeSteps: () => void;
  onGenerateBase: () => void;
  onIntegrateCharacter: () => void;
  onStartRefine: () => void;
  
  stepDescriptions: string[];
  
  avatarImage: string | null;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  
  watermarkText: string;
  setWatermarkText: (val: string) => void;
  
  panelCount: number;
  setPanelCount: (count: number) => void;
  
  generatedArt: string | null;
  
  isGeneratingCaptions: boolean;
  onGenerateCaptions: () => void;
  captionOptions: CaptionOption[];
  onCopyCaption: (text: string, index: number) => void;
  copiedIndex: number | null;
  sourceFrames: FrameData[];
  subPanels: SubPanel[];
  defaultPrompt: string;
}

interface StepItemProps {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const StepItem: React.FC<StepItemProps> = ({ step, title, isActive, isCompleted, isDisabled, onToggle, children }) => {
  return (
    <div className={`border-b border-slate-800 bg-slate-900 transition-opacity duration-300 ${isDisabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <button 
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-800/50 outline-none"
        onClick={onToggle}
        disabled={isDisabled}
      >
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border transition-all duration-300
            ${isActive 
              ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/20' 
              : isCompleted 
                ? 'bg-green-500/10 border-green-500 text-green-500' 
                : 'border-slate-600 text-slate-500 bg-slate-800'}`}>
            {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : step}
          </div>
          <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
            {title}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isActive ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0 pl-12 space-y-4">
           {children}
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onAvatarUpload(e);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const completedRefineCount = props.subPanels.filter(p => p.status === 'completed').length;

  return (
    <div className="w-full lg:w-96 h-[45vh] lg:h-full border-t lg:border-t-0 lg:border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 order-2 lg:order-1 relative z-20">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Step 1: Creative Analysis */}
        <StepItem 
          step={1} 
          title="创意分析" 
          isActive={props.viewStep === 1}
          isCompleted={props.stepDescriptions.length > 0}
          isDisabled={false} 
          onToggle={() => props.onStepChange(1)}
        >
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">
              {props.videoTitle ? (props.videoTitle.length > 15 ? props.videoTitle.substring(0, 15) + '...' : props.videoTitle) : '视频背景'}
            </label>
            <textarea
              value={props.contextDescription}
              onChange={(e) => props.setContextDescription(e.target.value)}
              placeholder="输入背景故事..."
              className="w-full h-14 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-700 custom-scrollbar mb-3"
              disabled={props.isGeneratingImage || props.isAnalyzingSteps}
            />

            <Button 
              onClick={props.onAnalyzeSteps}
              disabled={props.isAnalyzingSteps || props.isGeneratingImage}
              size="sm"
              className={`w-full ${props.stepDescriptions.length > 0 ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {props.isAnalyzingSteps ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  分析中...
                </>
              ) : props.stepDescriptions.length > 0 ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  重新分析
                </>
              ) : (
                <>
                  <ListChecks className="w-3.5 h-3.5 mr-2" />
                  分析关键步骤
                </>
              )}
            </Button>
          </div>
        </StepItem>

        {/* Step 2: Base Generation - ONLY APPEARS IF Step 1 Finished */}
        {props.stepDescriptions.length > 0 && (
          <StepItem 
            step={2} 
            title="画面生成" 
            isActive={props.viewStep === 2}
            isCompleted={!!props.generatedArt}
            isDisabled={false}
            onToggle={() => props.onStepChange(2)}
          >
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              AI 将根据分析结果绘制基础分镜。
            </p>
            
            <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] text-slate-500">提示词 (Prompt)</label>
                {!props.isGeneratingImage && !props.isAnalyzingSteps && (
                  <button onClick={() => props.setCustomPrompt(props.defaultPrompt)} className="text-[10px] text-indigo-400 hover:text-indigo-300">重置</button>
                )}
            </div>
            <textarea
              value={props.customPrompt}
              onChange={(e) => props.setCustomPrompt(e.target.value)}
              className="w-full h-14 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-700 custom-scrollbar mb-3"
              disabled={props.isGeneratingImage || props.isAnalyzingSteps}
            />

            <Button 
              onClick={props.onGenerateBase}
              disabled={props.isGeneratingImage}
              size="sm"
              className={`w-full ${props.generatedArt ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              {props.isGeneratingImage && !props.generatedArt ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  绘图中...
                </>
              ) : props.generatedArt ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  重新生成
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 mr-2" />
                  生成手绘分镜
                </>
              )}
            </Button>
          </StepItem>
        )}

        {/* Subsequent Steps - ONLY APPEAR IF Step 2 Finished */}
        {props.generatedArt && (
          <>
            {/* Step 3: Character Integration */}
            <StepItem 
              step={3} 
              title="角色融合 (可选)" 
              isActive={props.viewStep === 3}
              isCompleted={props.workflowStep === 'final_generated' || props.workflowStep === 'refine_mode'}
              isDisabled={!props.generatedArt}
              onToggle={() => props.generatedArt && props.onStepChange(3)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div 
                      onClick={() => avatarInputRef.current?.click()}
                      className={`w-12 h-12 rounded-lg border-2 border-dashed flex items-center justify-center transition-all overflow-hidden relative shrink-0 cursor-pointer ${
                        props.avatarImage ? 'border-pink-500 bg-slate-950' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      {props.avatarImage ? (
                        <img src={props.avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={handleFileChange} />
                      {props.avatarImage ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-white">角色图已上传</span>
                            <button onClick={props.onRemoveAvatar} className="text-[10px] text-red-400 hover:text-red-300 text-left w-fit">移除</button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 block">上传角色图以融入画面</span>
                      )}
                    </div>
                </div>

                {props.avatarImage && (
                  <div>
                    <label className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
                        个性水印
                    </label>
                    <input
                      type="text"
                      value={props.watermarkText}
                      onChange={(e) => props.setWatermarkText(e.target.value)}
                      placeholder="@ClipSketch"
                      className="w-full h-8 bg-slate-950 border border-slate-800 rounded px-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}

                <Button 
                  onClick={props.onIntegrateCharacter}
                  disabled={props.isGeneratingImage || !props.avatarImage}
                  size="sm"
                  className={`w-full ${!props.avatarImage ? 'opacity-50 cursor-not-allowed bg-slate-800' : 'bg-pink-600 hover:bg-pink-500 text-white'}`}
                >
                    {props.isGeneratingImage && props.avatarImage ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 mr-2" />
                    )}
                    {props.workflowStep === 'final_generated' ? "重新融合" : "开始融合"}
                </Button>
              </div>
            </StepItem>

            {/* Step 4: Refine */}
            <StepItem 
              step={4} 
              title="分镜精修" 
              isActive={props.viewStep === 4}
              isCompleted={completedRefineCount > 0}
              isDisabled={!props.generatedArt}
              onToggle={() => props.generatedArt && props.onStepChange(4)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 whitespace-nowrap">切分数量</label>
                  <input 
                    type="number"
                    min="1"
                    max="20"
                    value={props.panelCount}
                    onChange={(e) => props.setPanelCount(parseInt(e.target.value) || 0)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white w-full focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <Button 
                  onClick={props.onStartRefine}
                  disabled={props.isGeneratingImage || props.subPanels.some(p => p.status === 'generating')}
                  size="sm"
                  variant="secondary"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                >
                  <Grid3X3 className="w-3.5 h-3.5 mr-2" />
                  开启精修模式
                </Button>
              </div>
            </StepItem>

            {/* Step 5: Captions */}
            <StepItem 
              step={5} 
              title="社交文案" 
              isActive={props.viewStep === 5}
              isCompleted={props.captionOptions.length > 0}
              isDisabled={!props.generatedArt}
              onToggle={() => props.generatedArt && props.onStepChange(5)}
            >
              <Button 
                onClick={props.onGenerateCaptions}
                isLoading={props.isGeneratingCaptions}
                disabled={props.isGeneratingCaptions || props.isGeneratingImage}
                size="sm"
                className="w-full mb-3 bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                {props.captionOptions.length > 0 ? "重新生成文案" : "生成匹配文案"}
              </Button>

              {props.captionOptions.length > 0 && (
                <div className="space-y-3">
                  {props.captionOptions.map((opt, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-2 hover:border-slate-600 transition-colors group">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <span className="text-[10px] font-bold text-slate-400 line-clamp-1 flex-1" title={opt.title}>
                          {opt.title}
                        </span>
                        <button 
                          onClick={() => props.onCopyCaption(`${opt.title}\n\n${opt.content}`, idx)}
                          className={`shrink-0 p-1 rounded transition-all ${
                            props.copiedIndex === idx 
                            ? "text-green-400" 
                            : "text-slate-500 hover:text-white"
                          }`}
                        >
                          {props.copiedIndex === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                        {opt.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </StepItem>
          </>
        )}

      </div>
    </div>
  );
};