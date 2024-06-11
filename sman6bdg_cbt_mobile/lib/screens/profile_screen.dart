import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sman6bdg_cbt_mobile/providers/exams.dart';
import 'package:sman6bdg_cbt_mobile/utils/on_refresh.dart';

import '../providers/auth.dart';
import '../providers/profile.dart';
import '../utils/string_extension.dart';
import '../widgets/profile_avatar.dart';
import '../widgets/profile_list_tile.dart';
import 'profile_edit_screen.dart';

class ProfileScreen extends StatelessWidget {
  static const String routeName = '/profile';

  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Future<void> getProfile() {
      final profile = Provider.of<Profile>(context);

      if (profile.data == null) {
        return profile.getProfile();
      }

      return Future.value();
    }

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: () => onRefresh(context, () {
          Provider.of<Profile>(context, listen: false).getProfile();
        }),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics()),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Container(
                color: Theme.of(context).colorScheme.primary,
                child: const AspectRatio(
                  aspectRatio: 2 / 1,
                ),
              ),
              Consumer<Profile>(
                builder: (context, profile, child) => Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(context).canvasColor,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(48),
                      topRight: Radius.circular(48),
                    ),
                  ),
                  child: Column(
                    children: [
                      FutureBuilder(
                        future: getProfile(),
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return const SizedBox(
                              width: double.infinity,
                              height: 200,
                              child: Center(
                                child: CircularProgressIndicator(),
                              ),
                            );
                          }
                          if (snapshot.hasError) {
                            return const Center(
                              child: Text('Terjadi kesalahan'),
                            );
                          } else {
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SizedBox(
                                  width: double.infinity,
                                  child: Column(
                                    children: [
                                      ProfileAvatar(
                                        profile.data!.imagePath,
                                        profile.data!.images,
                                      ),
                                      const SizedBox(height: 16),
                                      Text(
                                        profile.data!.name,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleLarge,
                                      ),
                                      Text(profile.data!.username)
                                    ],
                                  ),
                                ),
                                ProfileListTile(
                                  icon: Icons.school_rounded,
                                  title: 'Kelas',
                                  subtitle: profile.data!.classroom!,
                                ),
                                ProfileListTile(
                                  icon: Icons.call_rounded,
                                  title: 'No. Telepon',
                                  subtitle: profile.data!.phone!,
                                ),
                                ProfileListTile(
                                  icon: Icons.email_rounded,
                                  title: 'Email',
                                  subtitle: profile.data!.email,
                                ),
                                ProfileListTile(
                                  icon: Icons.location_on_rounded,
                                  title: 'Alamat',
                                  subtitle:
                                      '${profile.data!.address} ${profile.data!.district}, ${profile.data!.regency} ${profile.data!.province}, ${profile.data!.postalCode}'
                                          .toTitleCase(),
                                ),
                              ],
                            );
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: () => Navigator.of(context)
                                    .pushNamed(ProfileEditScreen.rounteName),
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 16,
                                    horizontal: 32,
                                  ),
                                ),
                                icon: const Icon(Icons.edit_rounded),
                                label: Container(
                                  margin: const EdgeInsets.only(left: 16),
                                  alignment: Alignment.centerLeft,
                                  child: const Text('Edit Profil'),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  Provider.of<Auth>(context, listen: false)
                                      .logout();
                                  Provider.of<Profile>(context, listen: false)
                                      .resetProfile();
                                  Provider.of<Exams>(context, listen: false)
                                      .resetExam();
                                },
                                icon: const Icon(Icons.logout_rounded),
                                label: Container(
                                  margin: const EdgeInsets.only(left: 16),
                                  alignment: Alignment.centerLeft,
                                  child: const Text('Keluar'),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                      Theme.of(context).colorScheme.error,
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 16,
                                    horizontal: 32,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
