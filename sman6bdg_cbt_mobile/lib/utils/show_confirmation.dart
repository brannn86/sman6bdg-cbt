import 'package:flutter/material.dart';

void showConfirmation(
  BuildContext context,
  String title,
  String subtitle,
  String confirmText,
  String cancelText,
  Future Function() onConfirm,
) async {
  showModalBottomSheet(
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(
        top: Radius.circular(16),
      ),
    ),
    context: context,
    builder: (context) => Wrap(
      children: [
        Container(
          // height: MediaQuery.of(context).size.height * 0.3,
          padding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 32,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    onConfirm();
                  },
                  style: Theme.of(context).elevatedButtonTheme.style!.copyWith(
                        padding: const MaterialStatePropertyAll(
                          EdgeInsets.symmetric(
                            vertical: 12,
                          ),
                        ),
                        backgroundColor: MaterialStateProperty.all(
                          Theme.of(context).colorScheme.primary,
                        ),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(99),
                          ),
                        ),
                      ),
                  child: Text(confirmText),
                ),
              ),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: Theme.of(context).elevatedButtonTheme.style!.copyWith(
                        padding: const MaterialStatePropertyAll(
                          EdgeInsets.symmetric(
                            vertical: 12,
                          ),
                        ),
                        backgroundColor: MaterialStateProperty.all(
                          Theme.of(context).colorScheme.error,
                        ),
                        shape: MaterialStateProperty.all(
                          RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(99),
                          ),
                        ),
                      ),
                  child: Text(cancelText),
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}
