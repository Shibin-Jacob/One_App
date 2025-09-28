// Google OAuth Service
class GoogleAuthService {
  constructor() {
    this.isLoaded = false;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.initializeGoogleAPI();
  }

  initializeGoogleAPI() {
    if (window.google) {
      this.isLoaded = true;
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.isLoaded = true;
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn() {
    if (!window.google || !this.clientId) return;

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });
  }

  handleCredentialResponse(response) {
    // This will be overridden by the component using this service
    console.log('Google credential response:', response);
  }

  renderButton(elementId, onSuccess, onError) {
    if (!this.isLoaded || !window.google) {
      console.error('Google API not loaded');
      onError?.('Google API not loaded');
      return;
    }

    // Override the callback
    this.handleCredentialResponse = (response) => {
      if (response.credential) {
        onSuccess(response.credential);
      } else {
        onError?.('No credential received');
      }
    };

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%'
      }
    );
  }

  signOut() {
    if (this.isLoaded && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  isGoogleAPILoaded() {
    return this.isLoaded && !!window.google;
  }
}

// Create singleton instance
const googleAuthService = new GoogleAuthService();

export default googleAuthService;
