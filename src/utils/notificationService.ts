/**
 * Android and Web Native Notification Service for Clinic Konkur Planner
 */

import { audioService } from './audioService';

class NotificationService {
  private activeNotification: Notification | null = null;
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public hasPermission(): boolean {
    return this.isSupported() && Notification.permission === 'granted';
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const res = await Notification.requestPermission();
      this.permission = res;
      return res === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Shows currently active study session in phone notification bar
   */
  public showActiveStudy(subjectTitle: string, topic: string, remainingMinutes: number) {
    if (!this.hasPermission()) return;

    try {
      // Close previous ongoing notification to prevent spamming notification tray
      if (this.activeNotification) {
        this.activeNotification.close();
      }

      this.activeNotification = new Notification(`📚 در حال مطالعه: ${subjectTitle}`, {
        body: `مبحث: ${topic || 'مطالعه و حل تست'} | ⏳ زمان باقی‌مانده: ${remainingMinutes} دقیقه`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'clinic-konkur-active-study',
        silent: true, // Ongoing notification should be silent
      });
    } catch {
      // ignore
    }
  }

  /**
   * Fires alert notification and sound + vibration when study timer ends
   */
  public notifyStudyFinished(subjectTitle: string) {
    // 1. Play sound and haptic vibration
    audioService.playTimerAlarm();
    audioService.vibrate([400, 200, 400, 200, 600]);

    if (!this.hasPermission()) return;

    try {
      if (this.activeNotification) {
        this.activeNotification.close();
        this.activeNotification = null;
      }

      new Notification('⏰ پارت مطالعه به پایان رسید!', {
        body: `آفرین! پارت درس «${subjectTitle}» تمام شد. اکنون وقت ۱۵ دقیقه استراحت، نوشیدن آب و استراحت چشمان است. 👏`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'clinic-konkur-study-done',
        requireInteraction: true,
      });
    } catch {
      // ignore
    }
  }

  /**
   * Fires grand celebration notification when daily schedule is completed
   */
  public notifyDailyCompleted(completedParts: number, testsCount: number) {
    audioService.playVictoryFanfare();
    audioService.vibrate([200, 100, 200, 100, 400, 200, 600]);

    if (!this.hasPermission()) return;

    try {
      new Notification('🏆 تبریک قهرمان! برنامه امروزت ۱۰۰٪ کامل شد!', {
        body: `امروز ${completedParts} پارت کامل خوندی و ${testsCount} تست زدی! به تلاشت افتخار کن. فردا یک قدم به هدفت نزدیک‌تری. 🌟`,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'clinic-konkur-daily-complete',
        requireInteraction: true,
      });
    } catch {
      // ignore
    }
  }

  public clearActive() {
    if (this.activeNotification) {
      try {
        this.activeNotification.close();
      } catch {
        // ignore
      }
      this.activeNotification = null;
    }
  }
}

export const notificationService = new NotificationService();
