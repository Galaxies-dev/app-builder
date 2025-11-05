import { TextDecoderStream, TextEncoderStream } from '@stardazed/streams-text-encoding';
import structuredClone from '@ungap/structured-clone';
import { Platform } from 'react-native';
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }

    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };

  setupPolyfills();
}

export {};
