import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import FlashcardScreen from '../screens/FlashcardScreen';
import GoalsScreen from '../screens/GoalsScreen';
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import LoginScreen from '../screens/LoginScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen';
import QuizScreen from '../screens/QuizScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator({
  isAuthenticated,
  currentUser,
  pendingVerification,
  onLogin,
  onLogout,
  onCreateAccount,
  onVerifyEmail,
  onResendVerification,
  onCancelVerification,
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : pendingVerification ? 'VerifyEmail' : 'Login'}
        screenOptions={{
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '700',
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp" options={{ headerShown: false }}>
              {(props) => <SignUpScreen {...props} onCreateAccount={onCreateAccount} />}
            </Stack.Screen>
            <Stack.Screen name="VerifyEmail" options={{ headerShown: false }}>
              {(props) => (
                <VerifyEmailScreen
                  {...props}
                  pendingVerification={pendingVerification}
                  onVerifyEmail={onVerifyEmail}
                  onResendVerification={onResendVerification}
                  onCancelVerification={onCancelVerification}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <HomeScreen {...props} onLogout={onLogout} currentUser={currentUser} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DeckDetail" component={DeckDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Goals" component={GoalsScreen} options={{ title: 'Goals' }} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy & Data' }} />
            <Stack.Screen name="Flashcards" component={FlashcardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
            <Stack.Screen name="Progress" component={ProgressScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
