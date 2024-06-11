import 'package:flutter/material.dart';

class Greeting extends StatefulWidget {
  final String name;
  final String classroom;

  const Greeting({super.key, required this.name, required this.classroom});

  @override
  State<Greeting> createState() => _GreetingState();
}

class _GreetingState extends State<Greeting> {
  String get greetings {
    final now = DateTime.now().hour;
    if (now < 12) {
      return 'Selamat Pagi';
    } else if (now < 18) {
      return 'Selamat Siang';
    } else {
      return 'Selamat Malam';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          greetings,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        Text(widget.name, style: Theme.of(context).textTheme.titleLarge),
        Text(widget.classroom),
      ],
    );
  }
}
