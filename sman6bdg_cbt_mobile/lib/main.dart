import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'navigations/bottom_nav.dart';
import 'providers/auth.dart';
import 'providers/exams.dart';
import 'providers/profile.dart';
import 'providers/region.dart';
import 'screens/exam_screen.dart';
import 'screens/home.dart';
import 'screens/landing_page.dart';
import 'screens/login_screen.dart';
import 'screens/profile_edit_screen.dart';
import 'screens/splash_screen.dart';
import 'themes/light_theme.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => Auth(),
        ),
        ChangeNotifierProxyProvider<Auth, Profile>(
          create: (context) => Profile(null, null, null),
          update: (context, auth, previous) => Profile(
            auth.token,
            auth.resetToken,
            previous?.data,
          ),
        ),
        ChangeNotifierProxyProvider<Auth, Regions>(
          create: (context) => Regions(null, null),
          update: (context, auth, previous) =>
              Regions(auth.token, auth.resetToken),
        ),
        ChangeNotifierProxyProvider<Auth, Exams>(
          create: (context) => Exams(null, [], null),
          update: (context, auth, previous) =>
              Exams(auth.token, previous?.data ?? [], auth.resetToken),
        )
      ],
      child: Consumer<Auth>(
        builder: (context, auth, child) => MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'SMAN 6 BANDUNG CBT APPLICATION',
          theme: lightTheme,
          home: auth.isAuth
              ? const BottomNav()
              : FutureBuilder(
                  future: auth.tryAutoLogin(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const SplashScreen();
                    } else {
                      return const LoginScreen();
                    }
                  },
                ),
          routes: {
            BottomNav.routeName: (context) => const BottomNav(),
            Home.routeName: (context) => const Home(),
            SplashScreen.routeName: (context) => const SplashScreen(),
            LandingPage.routeName: (context) => const LandingPage(),
            LoginScreen.routeName: (context) => const LoginScreen(),
            ProfileEditScreen.rounteName: (context) =>
                const ProfileEditScreen(),
            ExamScreen.routeName: (context) => const ExamScreen(),
          },
        ),
      ),
    );
  }
}
