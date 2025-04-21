import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Animated, Dimensions, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export default function App() {
  const [pdfUri, setPdfUri] = useState(null);
  const moveAnim = useRef(new Animated.Value(0)).current;

  const today = new Date();
  const formattedDate = `01.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: width - 100,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [moveAnim]);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.assets && result.assets.length > 0) {
      setPdfUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      {/* Верхний логотип слева */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
        <Image
          source={require('./assets/lolo1.png')}
          style={{ width: 45, height: 45, resizeMode: 'contain', marginRight: 10 }}
        />
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 24 }}>  Deutschland-Ticket</Text>
          <Text style={{ fontSize: 22 }}>  Gültig vom {formattedDate}</Text>
        </View>
      </View>

      {/* Летающий логотип */}
      <Animated.View
        style={{
          transform: [{ translateX: moveAnim }],
          marginTop: 20,
        }}
      >
        <Image
          source={require('./assets/logo.png')}
          style={{ width: 60, height: 60, resizeMode: 'contain' }}
        />
      </Animated.View>

      <View style={{ margin: 20 }}>
        <Button title="PDF auswählen" onPress={pickDocument} />
      </View>

      {pdfUri && (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: pdfUri }}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
}
