import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RotateScreenPrompt: React.FC = () => {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('dismiss_rotate_prompt') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 900;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsPortraitMobile(isMobile && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('dismiss_rotate_prompt', 'true');
    } catch {
      // ignore
    }
  };

  if (!isPortraitMobile || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4 bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border-2 border-cyan-400/60 rounded-2xl p-3.5 sm:p-4 text-slate-100 shadow-xl shadow-cyan-950/30 relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-cyan-300 transform rotate-90 animate-pulse" />
              <RotateCw className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white">
                  💡 پیشنهاد کلینیک پلن: از حالت افقی (Landscape) استفاده کنید!
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/90 mt-0.5 leading-relaxed">
                برای مشاهده هم‌زمان تمام ۸ پارت درسی بدون نیاز به اسکرول افقی، گوشی خود را به حالت افقی بچرخانید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-lg text-[11px] font-bold transition-colors"
            >
              متوجه شدم
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
