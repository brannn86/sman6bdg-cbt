import 'dart:io';

import 'package:flutter/material.dart';

class ProfileAvatar extends StatelessWidget {
  final String? _imageUrl;
  final String? _imageFile;

  const ProfileAvatar(this._imageUrl, this._imageFile, {super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 148,
      height: 148 / 2,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: -(148 / 2),
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(
                  color: Theme.of(context).canvasColor,
                  width: 6,
                ),
                color: Theme.of(context).colorScheme.primary,
                borderRadius: BorderRadius.circular(28),
              ),
              width: 148,
              child: AspectRatio(
                aspectRatio: 1,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: _imageFile != null
                      ? Image.file(
                          File(_imageFile!),
                          fit: BoxFit.cover,
                        )
                      : _imageUrl != null
                          ? Image.network(
                              _imageUrl!,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  Image.asset(
                                'assets/images/avatar.png',
                                fit: BoxFit.cover,
                              ),
                            )
                          : Image.asset(
                              'assets/images/avatar.png',
                              fit: BoxFit.cover,
                            ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
