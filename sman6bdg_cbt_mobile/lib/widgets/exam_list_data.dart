import 'package:flutter/material.dart';

import '../helpers/date_format_local.dart';
import '../providers/exam.dart';
import '../utils/show_confirmation.dart';
import '../utils/start_exam_dialog.dart';

class ExamListData extends StatelessWidget {
  final List<Exam> data;
  final Future<void> Function(int) startExam;

  const ExamListData({super.key, required this.data, required this.startExam});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics:
          const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
      itemCount: data.length,
      itemBuilder: (context, index) => Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                data[index].name,
                style: Theme.of(context).textTheme.titleMedium!.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Dimulai: ${dateFormatLocal(data[index].startAt)}',
              ),
              Text(
                'Berakhir: ${dateFormatLocal(data[index].endAt)}',
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: data[index].status != Status.ongoing
                      ? null
                      : () => showConfirmation(
                            context,
                            'Apakah anda yakin ingin memulai ujian?',
                            'Pastikan anda sudah siap memulai ujian',
                            'Mulai',
                            'Batal',
                            () => startExamDialog(
                                context, data, index, startExam),
                          ),
                  style: Theme.of(context).elevatedButtonTheme.style!.copyWith(
                        backgroundColor: data[index].status == Status.finished
                            ? MaterialStateProperty.all(
                                Theme.of(context).colorScheme.secondary,
                              )
                            : data[index].status == Status.upcoming
                                ? MaterialStateProperty.all(
                                    Theme.of(context).colorScheme.error)
                                : null,
                      ),
                  child: data[index].status == Status.ongoing
                      ? const Text('Dibuka')
                      : data[index].status == Status.finished
                          ? const Text('Selesai')
                          : const Text('Dikunci'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
