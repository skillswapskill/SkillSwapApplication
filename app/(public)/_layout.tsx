import { Stack } from 'expo-router';
import React from 'react';

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name='Dashboard'/>
      <Stack.Screen name='profile'/>
      <Stack.Screen name='MySessions'/>
      <Stack.Screen name='ReedemCredits'/>
    </Stack>
  );
};

export default PublicLayout;
