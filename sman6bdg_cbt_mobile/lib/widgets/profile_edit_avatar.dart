import 'dart:io';

import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

class ProfileEditAvatar extends StatelessWidget {
  final String? _imageUrl;
  final File? _imageFile;
  final Future<void> Function(ImageSource) _imagePicker;

  const ProfileEditAvatar(this._imageUrl, this._imageFile, this._imagePicker,
      {super.key});

  Future<void> _pickImage(BuildContext context, ImageSource source) async {
    final scaffold = ScaffoldMessenger.of(context);

    Permission permission;

    if (Platform.isAndroid) {
      final androidInfo = await DeviceInfoPlugin().androidInfo;
      permission = androidInfo.version.sdkInt <= 32
          ? Permission.storage
          : Permission.photos;
    } else {
      permission = Permission.photos;
    }

    try {
      if (await permission.status.isGranted) {
        await _imagePicker(
          source,
        );
      } else if (await permission.status.isDenied) {
        if (await permission.request().isGranted) {
          _imagePicker(
            source,
          );
        }
      } else {
        openAppSettings();
      }
    } catch (e) {
      scaffold.showSnackBar(
        const SnackBar(
          content: Text('Gagal memuat gambar'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: SizedBox(
            width: 128,
            child: AspectRatio(
              aspectRatio: 1,
              child: _imageFile != null
                  ? Image.file(
                      _imageFile!,
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
        Positioned(
          bottom: -10,
          right: -10,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: SizedBox(
              width: 48,
              height: 48,
              child: Material(
                color: Theme.of(context).colorScheme.primary,
                child: InkWell(
                  onTap: () => showModalBottomSheet(
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                    ),
                    context: context,
                    builder: (context) => Container(
                      padding: const EdgeInsets.all(32),
                      height: 200,
                      width: double.infinity,
                      decoration: const BoxDecoration(
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(24),
                          topRight: Radius.circular(24),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Foto Profil',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Column(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: SizedBox(
                                      width: 58,
                                      height: 58,
                                      child: Material(
                                        color: Theme.of(context).cardColor,
                                        child: InkWell(
                                          onTap: () async {
                                            await _pickImage(
                                              context,
                                              ImageSource.camera,
                                            );

                                            if (context.mounted) {
                                              Navigator.of(context).pop();
                                            }
                                          },
                                          child: Icon(
                                            Icons.camera_alt,
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text('Kamera')
                                ],
                              ),
                              const SizedBox(width: 16),
                              Column(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: SizedBox(
                                      width: 58,
                                      height: 58,
                                      child: Material(
                                        color: Theme.of(context).cardColor,
                                        child: InkWell(
                                          onTap: () async {
                                            await _pickImage(
                                              context,
                                              ImageSource.gallery,
                                            );

                                            if (context.mounted) {
                                              Navigator.of(context).pop();
                                            }
                                          },
                                          child: Icon(
                                            Icons.photo_rounded,
                                            color: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text('Galeri')
                                ],
                              )
                            ],
                          )
                        ],
                      ),
                    ),
                  ),
                  child: const Icon(
                    Icons.camera_alt,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
