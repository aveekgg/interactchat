import React, { useState, useEffect } from 'react';
import { configureGeminiService, getGeminiService } from '../services/geminiService';
import './Settings.css';

interface SettingsProps {
  onClose: () => void;
  onAIModeChange: (enabled: boolean) => void;
  currentAIMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onClose, onAIModeChange, currentAIMode }) => {
  const [apiKey, setApiKey] = useState('');
  const [isAIEnabled, setIsAIEnabled] = useState(currentAIMode);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // Check if API key is already configured
    const geminiService = getGeminiService();
    setIsAIEnabled(geminiService.isReady());
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Gemini API key');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Configure the service
      configureGeminiService({ apiKey: apiKey.trim() });
      
      // Test the connection
      const geminiService = getGeminiService();
      const isWorking = await geminiService.testConnection();

      if (isWorking) {
        setTestResult('success');
        setIsAIEnabled(true);
        onAIModeChange(true);
        
        // Save to localStorage for persistence
        localStorage.setItem('gemini_api_key', apiKey.trim());
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setTestResult('error');
        setIsAIEnabled(false);
      }
    } catch (error) {
      console.error('Error configuring API:', error);
      setTestResult('error');
      setIsAIEnabled(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleAI = () => {
    const newState = !isAIEnabled;
    setIsAIEnabled(newState);
    onAIModeChange(newState);
  };

  const handleLoadFromStorage = () => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      configureGeminiService({ apiKey: storedKey });
      setIsAIEnabled(true);
      onAIModeChange(true);
    }
  };

  useEffect(() => {
    // Auto-load API key from localStorage on mount
    handleLoadFromStorage();
  }, []);

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="settings-content">
          <h2>⚙️ Settings</h2>

          <div className="settings-section">
            <h3>🤖 AI Sales Assistant</h3>
            <p className="settings-description">
              Enable AI-powered responses using Google's Gemini API for more natural and contextual conversations.
            </p>

            <div className="toggle-container">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isAIEnabled}
                  onChange={handleToggleAI}
                  disabled={!getGeminiService().isReady()}
                />
                <span className="toggle-switch"></span>
                <span className="toggle-text">
                  {isAIEnabled ? 'AI Enabled ✨' : 'Pattern Matching Mode'}
                </span>
              </label>
            </div>

            {!getGeminiService().isReady() && (
              <div className="warning-box">
                ⚠️ Configure your Gemini API key below to enable AI mode
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>🔑 Gemini API Key</h3>
            <p className="settings-description">
              Get your free API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>

            <div className="api-key-input-container">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="api-key-input"
              />
              <button
                className="toggle-visibility"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              className="save-button"
              onClick={handleSaveApiKey}
              disabled={isTesting || !apiKey.trim()}
            >
              {isTesting ? 'Testing...' : 'Save & Test Connection'}
            </button>

            {testResult === 'success' && (
              <div className="success-box">
                ✅ API key configured successfully! AI mode is now available.
              </div>
            )}

            {testResult === 'error' && (
              <div className="error-box">
                ❌ Failed to connect. Please check your API key and try again.
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>📋 Current Mode</h3>
            <div className="mode-indicator">
              {isAIEnabled && getGeminiService().isReady() ? (
                <div className="mode-active">
                  <span className="mode-icon">🤖</span>
                  <div>
                    <strong>AI Sales Assistant Active</strong>
                    <p>Using Gemini API for intelligent responses</p>
                  </div>
                </div>
              ) : (
                <div className="mode-fallback">
                  <span className="mode-icon">🔍</span>
                  <div>
                    <strong>Pattern Matching Mode</strong>
                    <p>Using rule-based responses</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="settings-footer">
            <p className="settings-note">
              💡 Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
