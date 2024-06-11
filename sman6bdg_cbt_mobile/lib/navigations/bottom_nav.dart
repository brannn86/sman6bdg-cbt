import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';

import '../screens/evaluation_screen.dart';
import '../screens/home.dart';
import '../screens/profile_screen.dart';

class BottomNav extends StatefulWidget {
  static const String routeName = '/root';

  const BottomNav({super.key});

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  final List<Map<String, Object>> _screens = [
    {
      'title': 'SMAN 6 Bandung CBT Application',
      'screen': const Home(),
    },
    {
      'title': 'Evaluasi',
      'screen': const Evaluation(),
    },
    {
      'title': 'Profil',
      'screen': const ProfileScreen(),
    },
  ];

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('id');
  }

  int _selectedScreenIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _selectedScreenIndex != 2
          ? AppBar(
              title: Text(_screens[_selectedScreenIndex]['title'] as String),
            )
          : null,
      body: _screens[_selectedScreenIndex]['screen'] as Widget,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedScreenIndex,
        onTap: (index) => setState(() {
          _selectedScreenIndex = index;
        }),
        enableFeedback: false,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment_rounded),
            label: 'Evaluasi',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
