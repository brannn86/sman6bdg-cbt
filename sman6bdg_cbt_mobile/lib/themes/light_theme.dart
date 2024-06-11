import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

ThemeData lightTheme = ThemeData(
  colorScheme: const ColorScheme.light(
      primary: Color.fromRGBO(62, 97, 155, 1),
      secondary: Color.fromRGBO(62, 155, 95, 1),
      error: Color.fromRGBO(239, 75, 75, 1)),
  appBarTheme: const AppBarTheme(
    foregroundColor: Colors.white,
    elevation: 0,
    titleTextStyle: TextStyle(
      color: Colors.white,
      fontSize: 20,
      fontWeight: FontWeight.w600,
    ),
    systemOverlayStyle: SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
    ),
  ),
  canvasColor: const Color.fromRGBO(219, 219, 219, 1),
  cardTheme: const CardTheme(color: Colors.white),
  textTheme: const TextTheme(
    titleLarge: TextStyle(color: Colors.black, fontWeight: FontWeight.w600),
    bodySmall: TextStyle(height: 1.5),
    titleSmall: TextStyle(color: Colors.black54),
  ),
  fontFamily: 'Montserrat',
  bottomNavigationBarTheme: const BottomNavigationBarThemeData(
    selectedIconTheme: IconThemeData(color: Color.fromRGBO(62, 97, 155, 1)),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ButtonStyle(
      enableFeedback: false,
      shape: MaterialStateProperty.all(
        RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      padding: MaterialStateProperty.all(
          const EdgeInsets.symmetric(horizontal: 16, vertical: 8)),
      foregroundColor: MaterialStateProperty.all(Colors.white),
    ),
  ),
  progressIndicatorTheme: const ProgressIndicatorThemeData(
    color: Colors.black,
  ),
);
