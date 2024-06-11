import 'package:flutter/material.dart';

showLoadingDialog(BuildContext context, String message,
    {bool barrierDismissible = false}) {
  showDialog(
    context: context,
    barrierDismissible: barrierDismissible,
    builder: (context) => Center(
      child: Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 32),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
              ),
            ),
            const SizedBox(width: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    ),
  );
}
