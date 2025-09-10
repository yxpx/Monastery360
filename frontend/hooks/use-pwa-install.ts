"use client"

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAInstallState {
  isInstallable: boolean
  isInstalled: boolean
  isStandalone: boolean
  canInstall: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

export function usePWAInstall() {
  const [installState, setInstallState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    installPrompt: null,
  })

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInstalled = window.navigator.standalone || isStandalone

    // Check if service worker is supported
    const isInstallable = 'serviceWorker' in navigator

    setInstallState(prev => ({
      ...prev,
      isInstallable,
      isInstalled,
      isStandalone,
    }))

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      
      setInstallState(prev => ({
        ...prev,
        canInstall: true,
        installPrompt: promptEvent,
      }))
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstallState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        installPrompt: null,
      }))
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!installState.installPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt
      // Show instructions for manual installation
      showInstallInstructions()
      return
    }

    try {
      // Show the install prompt
      await installState.installPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const choiceResult = await installState.installPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setInstallState(prev => ({
          ...prev,
          isInstalled: true,
          canInstall: false,
          installPrompt: null,
        }))
      } else {
        console.log('User dismissed the install prompt')
      }
    } catch (error) {
      console.error('Error during installation:', error)
      showInstallInstructions()
    }
  }

  const showInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    let instructions = ''

    if (userAgent.includes('chrome') || userAgent.includes('edge')) {
      instructions = `
        To install Monastery360:
        1. Click the three dots menu (⋮) in your browser
        2. Select "Install Monastery360" or "Add to Home screen"
        3. Click "Install" when prompted
      `
    } else if (userAgent.includes('firefox')) {
      instructions = `
        To install Monastery360:
        1. Click the three lines menu (☰) in your browser
        2. Select "Install" or "Add to Home Screen"
        3. Click "Add" when prompted
      `
    } else if (userAgent.includes('safari')) {
      instructions = `
        To install Monastery360:
        1. Tap the Share button (□↗) at the bottom
        2. Scroll down and tap "Add to Home Screen"
        3. Tap "Add" to confirm
      `
    } else {
      instructions = `
        To install Monastery360:
        1. Look for an install option in your browser menu
        2. Or add this page to your home screen
        3. The app will work offline once installed
      `
    }

    alert(instructions)
  }

  return {
    ...installState,
    installApp,
    showInstallInstructions,
  }
}
