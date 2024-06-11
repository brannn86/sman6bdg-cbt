import 'package:flutter/material.dart';

import 'login_screen.dart';

class LandingPage extends StatelessWidget {
  static const String routeName = '/landing_page';

  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SMAN 6 BANDUNG CBT APPLICATION'),
      ),
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 100),
            Image.asset('assets/images/logo.png'),
            Text(
              'Selamat Datang',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            SizedBox(
              child: ElevatedButton(
                onPressed: () =>
                    Navigator.pushNamed(context, LoginScreen.routeName),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 48,
                    vertical: 8,
                  ),
                ),
                child: const Text('Login'),
              ),
            )
          ],
        ),
      ),
    );
  }
}
