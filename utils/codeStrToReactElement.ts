import * as Babel from '@babel/standalone';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function codeStrToReactElement(code: string) {
  try {
    const transformed = Babel.transform(code.trim(), {
      presets: ['react', 'typescript'],
      filename: 'component.tsx',
      plugins: [['transform-modules-commonjs', { strict: false }]],
    }).code;

    const moduleCode = `
      const exports = {};
      const module = { exports };
      
      const require = (name) => {
        if (name === 'react') return React;
        if (name === 'react-native') return { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, StyleSheet };
        if (name === '@instantdb/react-native') return { i, id, init, InstaQLEntity: {} };
        throw new Error('Module not found: ' + name);
      };
      
      ${transformed}
      
      return module.exports.default || module.exports;
    `;

    const moduleFn = new Function(
      'React',
      'View',
      'Text',
      'TouchableOpacity',
      'Alert',
      'ScrollView',
      'TextInput',
      'StyleSheet',
      moduleCode
    );

    const Component = moduleFn(
      React,
      View,
      Text,
      TouchableOpacity,
      Alert,
      ScrollView,
      TextInput,
      StyleSheet
    );

    const element = React.createElement(Component);

    return { ok: true, element };
  } catch (error) {
    console.error('Error transforming code:', error);
    return { ok: false, error, element: undefined };
  }
}
