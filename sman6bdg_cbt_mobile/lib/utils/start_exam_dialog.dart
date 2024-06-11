import 'package:flutter/material.dart';

import '../model/exams_args.dart';
import '../providers/exam.dart';
import '../screens/exam_screen.dart';

Future<void> startExamDialog(
  BuildContext context,
  List<Exam> exams,
  int currentExam,
  Future<void> Function(int) startExam,
) async {
  try {
    showModalBottomSheet(
      isDismissible: false,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(16),
        ),
      ),
      context: context,
      builder: (context) => Wrap(
        children: [
          Container(
            height: MediaQuery.of(context).size.height * 0.15,
            padding: const EdgeInsets.all(32),
            child: Row(
              children: [
                const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                  ),
                ),
                const SizedBox(width: 16),
                Text(
                  'Loading',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
          ),
        ],
      ),
    );
    await startExam(exams[currentExam].id);

    if (context.mounted) {
      Navigator.pop(context);
      Navigator.pushNamed(
        context,
        ExamScreen.routeName,
        arguments: ExamsArgs(
          id: exams[currentExam].id,
          title: exams[currentExam].name,
          questions: exams[currentExam].questions,
          endAt: exams[currentExam].endAt,
        ),
      );
    }
  } catch (e) {
    Navigator.pop(context);
    showModalBottomSheet(
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(16),
        ),
      ),
      context: context,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.15,
        padding: const EdgeInsets.all(16),
        child: Center(
          child: Text(
            e.toString().split(': ')[1],
            style: Theme.of(context).textTheme.titleMedium,
          ),
        ),
      ),
    );
  }
}
