/**
 * Offline Audio & Ambient Sound Service for Clinic Konkur Planner
 * Pure procedural Web Audio API synthesis - 100% offline, zero network or external files.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private rainGainNode: GainNode | null = null;
  private rainNodes: AudioNode[] = [];
  private rainDropletInterval: number | null = null;
  private isRainPlaying: boolean = false;
  private currentVolume: number = 0.45;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  /**
   * Starts soothing procedural rain ambient sound
   */
  public async startRain(volume: number = 0.45): Promise<boolean> {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return false;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.stopRain(); // Clean previous instance if any
      this.currentVolume = Math.max(0.05, Math.min(1.0, volume));

      // Master Gain for Rain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.currentVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.rainGainNode = masterGain;

      // 1. Steady rainfall layer (filtered noise)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Body bandpass filter (steady rainfall whoosh)
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);

      const rainLayerGain = ctx.createGain();
      rainLayerGain.gain.setValueAtTime(0.7, ctx.currentTime);

      noiseSource.connect(rainFilter);
      rainFilter.connect(rainLayerGain);
      rainLayerGain.connect(masterGain);

      noiseSource.start(0);

      this.rainNodes.push(noiseSource, rainFilter, rainLayerGain);

      // 2. High-frequency gentle drizzle layer
      const drizzleFilter = ctx.createBiquadFilter();
      drizzleFilter.type = 'bandpass';
      drizzleFilter.frequency.setValueAtTime(2600, ctx.currentTime);
      drizzleFilter.Q.setValueAtTime(1.0, ctx.currentTime);

      const drizzleGain = ctx.createGain();
      drizzleGain.gain.setValueAtTime(0.2, ctx.currentTime);

      noiseSource.connect(drizzleFilter);
      drizzleFilter.connect(drizzleGain);
      drizzleGain.connect(masterGain);

      this.rainNodes.push(drizzleFilter, drizzleGain);

      // 3. Random soft water droplets simulator
      this.rainDropletInterval = window.setInterval(() => {
        if (!this.isRainPlaying || !this.ctx || this.ctx.state !== 'running') return;
        this.playRandomDroplet(masterGain);
      }, 160);

      this.isRainPlaying = true;
      return true;
    } catch (e) {
      console.warn('Procedural rain audio initialization prevented or blocked:', e);
      return false;
    }
  }

  private playRandomDroplet(destination: AudioNode) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      const freq = 1200 + Math.random() * 1800; // 1.2kHz to 3.0kHz droplet pitch
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, this.ctx.currentTime + 0.05);

      const vol = 0.03 + Math.random() * 0.06;
      dropGain.gain.setValueAtTime(vol, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(dropGain);
      dropGain.connect(destination);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // ignore
    }
  }

  public setRainVolume(volume: number) {
    this.currentVolume = Math.max(0.0, Math.min(1.0, volume));
    if (this.rainGainNode && this.ctx) {
      try {
        this.rainGainNode.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
      } catch {
        // ignore
      }
    }
  }

  public stopRain() {
    this.isRainPlaying = false;
    if (this.rainDropletInterval) {
      clearInterval(this.rainDropletInterval);
      this.rainDropletInterval = null;
    }

    if (this.rainGainNode && this.ctx) {
      try {
        this.rainGainNode.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.05);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      this.rainNodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore
        }
      });
      this.rainNodes = [];
      this.rainGainNode = null;
    }, 100);
  }

  public isRainActive(): boolean {
    return this.isRainPlaying;
  }

  /**
   * Distinct, melodic 3-tone notification chime when study part timer finishes
   */
  public async playTimerAlarm() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume();

      // Triple bell notes: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.3, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Triumphant Victory Fanfare for 100% daily schedule completion
   */
  public async playVictoryFanfare() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') await ctx.resume();

      const chords = [
        [523.25, 659.25, 783.99],       // C Major
        [587.33, 739.99, 880.00],       // D Major
        [659.25, 830.61, 987.77],       // E Major
        [783.99, 987.77, 1174.66, 1567.98] // Grand G/C Climax
      ];

      const now = ctx.currentTime;
      chords.forEach((chord, step) => {
        const startTime = now + step * 0.22;
        const duration = step === chords.length - 1 ? 0.9 : 0.28;

        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.18, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration + 0.05);
        });
      });
    } catch {
      // ignore
    }
  }

  /**
   * Triggers device haptic feedback / vibration
   */
  public vibrate(pattern: number[] = [300, 150, 300, 150, 500]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }
}

export const audioService = new AudioService();
