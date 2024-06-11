import 'package:flutter/material.dart';

class ProfileListTile extends StatelessWidget {
  final IconData icon;
  final String? title;
  final String subtitle;

  const ProfileListTile({
    super.key,
    required this.icon,
    this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon),
        ],
      ),
      title: title != null
          ? Text(
              title!,
              style: Theme.of(context).textTheme.bodyLarge,
            )
          : null,
      subtitle: Text(
        subtitle,
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 16,
        ),
      ),
    );
  }
}
