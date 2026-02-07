import { registerPlugin } from '@capacitor/core';

// Fix for 'capacitor-plugin-send-intent' being incompatible with Capacitor 6+
// The original plugin uses deprecated 'registerWebPlugin'
// We re-implement the registration using the modern API

export const SendIntent = registerPlugin('SendIntent', {
    web: {
        checkSendIntentReceived: async () => {
            console.log('SendIntent: Web fallback (no-op)');
            return { url: '' };
        }
    }
});
