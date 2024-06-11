import 'package:flutter/material.dart';

class AppBarLeading extends StatelessWidget {
  const AppBarLeading({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      enableFeedback: false,
      icon: const Icon(Icons.arrow_back),
      onPressed: () => Navigator.pop(context),
    );
  }
}
