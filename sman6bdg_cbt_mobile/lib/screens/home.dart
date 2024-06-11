import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:skeletons/skeletons.dart';
import 'package:sman6bdg_cbt_mobile/utils/on_refresh.dart';

import '../providers/exam.dart';
import '../providers/exams.dart';
import '../providers/profile.dart';
import '../utils/show_confirmation.dart';
import '../utils/start_exam_dialog.dart';
import '../widgets/greeting.dart';

class Home extends StatelessWidget {
  static const String routeName = '/home';

  const Home({super.key});

  Future<void>? getProfile(BuildContext context) {
    if (Provider.of<Profile>(context).data == null) {
      return Provider.of<Profile>(context, listen: false).getProfile();
    }

    return null;
  }

  Future<void>? getExams(BuildContext context) {
    if (Provider.of<Exams>(context).data.isEmpty) {
      return Provider.of<Exams>(context, listen: false).fetchExams();
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer2<Profile, Exams>(
        builder: (context, profile, exams, child) {
          final upcomingExams = exams.data
              .where((exam) => (exam.status == Status.upcoming ||
                  exam.status == Status.ongoing))
              .toList();

          return RefreshIndicator(
            onRefresh: () => onRefresh(context, () {
              profile.getProfile();
              exams.fetchExams();
            }),
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
              ),
              width: double.infinity,
              child: ListView(
                physics: const BouncingScrollPhysics(
                  parent: AlwaysScrollableScrollPhysics(),
                ),
                children: [
                  const SizedBox(height: 32),
                  SizedBox(
                    height: 58,
                    child: FutureBuilder(
                      future: getProfile(context),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return SkeletonParagraph(
                            style: const SkeletonParagraphStyle(
                              lineStyle: SkeletonLineStyle(
                                height: 11,
                                randomLength: true,
                              ),
                              lines: 3,
                              spacing: 2.5,
                            ),
                          );
                        }
                        if (snapshot.hasError) {
                          return Text(
                            snapshot.error.toString(),
                            style: Theme.of(context).textTheme.titleLarge,
                          );
                        } else {
                          return Greeting(
                            name: profile.data!.name,
                            classroom: profile.data!.classroom!,
                          );
                        }
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 200,
                    child: Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Ujian Mendatang',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  FutureBuilder(
                    future: getExams(context),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return SingleChildScrollView(
                          child: Column(
                            children: [
                              for (int i = 0; i < 5; i++)
                                Column(
                                  children: const [
                                    ListTile(
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(16),
                                        ),
                                      ),
                                      tileColor: Colors.white,
                                      title: SkeletonLine(
                                        style: SkeletonLineStyle(
                                          height: 16,
                                          randomLength: true,
                                        ),
                                      ),
                                      subtitle: SkeletonLine(
                                        style: SkeletonLineStyle(
                                          height: 12,
                                          randomLength: true,
                                        ),
                                      ),
                                      trailing: ElevatedButton(
                                        onPressed: null,
                                        child: Text('Mulai'),
                                      ),
                                    ),
                                    SizedBox(height: 8)
                                  ],
                                ),
                            ],
                          ),
                        );
                      }
                      if (snapshot.hasError) {
                        return const Text(
                          'Gagal mengambil data, silakan coba lagi nanti.',
                        );
                      } else {
                        if (upcomingExams.isEmpty) {
                          return const Text(
                            'Tidak ada ujian mendatang.',
                          );
                        }
                        return ListView.builder(
                          physics: const ClampingScrollPhysics(),
                          shrinkWrap: true,
                          itemCount: upcomingExams.length,
                          itemBuilder: (context, index) => Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              shape: const RoundedRectangleBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(16),
                                ),
                              ),
                              tileColor: Colors.white,
                              title: Text(
                                upcomingExams[index].name,
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600),
                              ),
                              subtitle: Text(
                                '${DateFormat('dd LLL yyyy hh:mm', 'id_ID').format(DateTime.parse(upcomingExams[index].startAt))} - ${DateFormat.Hm().format(DateTime.parse(exams.data[index].endAt))}',
                              ),
                              trailing: ElevatedButton(
                                onPressed: () => showConfirmation(
                                  context,
                                  'Apakah anda yakin ingin memulai ujian?',
                                  'Pastikan anda sudah siap memulai ujian',
                                  'Mulai',
                                  'Batal',
                                  () => startExamDialog(context, upcomingExams,
                                      index, exams.startExam),
                                ),
                                child: const Text('Mulai'),
                              ),
                            ),
                          ),
                        );
                      }
                    },
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
