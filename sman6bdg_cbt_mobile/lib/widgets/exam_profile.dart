import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/profile.dart';

class ExamProfile extends StatelessWidget {
  const ExamProfile({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<Profile>(
      builder: (context, profile, child) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: profile.data == null
            ? const Center(
                child: CircularProgressIndicator(),
              )
            : Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.person_rounded),
                      const SizedBox(width: 8),
                      Text(
                        profile.data!.name,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 16),
                      )
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(Icons.school_rounded),
                      const SizedBox(width: 8),
                      Text(
                        profile.data!.classroom!,
                        style: const TextStyle(fontSize: 16),
                      )
                    ],
                  ),
                ],
              ),
      ),
    );
  }
}
