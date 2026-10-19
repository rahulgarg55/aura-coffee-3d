/**
 * Aura Atelier Ambient Audio Synthesizer
 * Uses the Web Audio API to create authentic, binaural café soundscapes
 * (Vinyl warmth, espresso steam, gentle rain, and mellow Rhodes jazz chords)
 * 100% client-side, zero external MP3 dependencies, no broken links!
 */

class CafeSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private currentPreset: "rainy-roastery" | "tokyo-midnight" | "milan-morning" = "tokyo-midnight";
  private chordInterval: NodeJS.Timeout | null = null;
  private noiseNodes: AudioNode[] = [];

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx?.currentTime || 0, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getPreset(): string {
    return this.currentPreset;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(this.currentPreset);
      return true;
    }
  }

  public start(preset: "rainy-roastery" | "tokyo-midnight" | "milan-morning" = "tokyo-midnight") {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.stop();

    this.currentPreset = preset;
    this.isPlaying = true;

    // 1. Generate Warm Pink Noise & Vinyl Crackle
    this.createVinylNoise();

    // 2. Generate Ambient Steam & Rain Atmosphere
    this.createSteamAtmosphere();

    // 3. Mellow Lofi Chords
    this.startLofiChordProgression();
  }

  public stop() {
    this.isPlaying = false;
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    this.noiseNodes.forEach((node) => {
      try {
        if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore already stopped nodes
      }
    });
    this.noiseNodes = [];
  }

  private createVinylNoise() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;

      // Add gentle vinyl micro-pops
      if (Math.random() < 0.0006) {
        data[i] += (Math.random() * 2 - 1) * 0.25;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to soft vintage warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 650;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.22;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.noiseNodes.push(noise, filter, gain);
  }

  private createSteamAtmosphere() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const steamSource = this.ctx.createBufferSource();
    steamSource.buffer = buffer;
    steamSource.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1800;
    bandpass.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;

    steamSource.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    steamSource.start();
    this.noiseNodes.push(steamSource, bandpass, gain);
  }

  private startLofiChordProgression() {
    if (!this.ctx) return;
    // Ambient jazz chord frequencies (Dmaj9, F#m9, Gmaj7, A7sus4)
    const chords = [
      [146.83, 220.00, 277.18, 329.63, 440.00], // Dmaj9
      [185.00, 220.00, 277.18, 369.99, 415.30], // F#m9
      [196.00, 246.94, 293.66, 369.99, 440.00], // Gmaj7
      [220.00, 293.66, 329.63, 392.00, 440.00], // A7sus4
    ];

    let chordIdx = 0;
    const playNextChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const freqs = chords[chordIdx % chords.length];
      chordIdx++;

      freqs.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const noteFilter = this.ctx.createBiquadFilter();

        // Warm electric piano tone (sine with subtle triangle wave)
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;

        noteFilter.type = "lowpass";
        noteFilter.frequency.value = 950;

        const now = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        // Soft bloom attack
        noteGain.gain.linearRampToValueAtTime(0.045 / freqs.length, now + 1.2);
        // Long lofi decay
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 5.6);
      });
    };

    playNextChord();
    this.chordInterval = setInterval(playNextChord, 6000);
  }
}

export const soundscape = new CafeSoundscapeEngine();
