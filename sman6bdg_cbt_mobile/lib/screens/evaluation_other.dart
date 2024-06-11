import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sman6bdg_cbt_mobile/utils/on_refresh.dart';

import '../providers/exams.dart';
import '../widgets/exam_list_data.dart';

class EvaluationOther extends StatefulWidget {
  const EvaluationOther({super.key});

  @override
  State<EvaluationOther> createState() => _EvaluationOtherState();
}

class _EvaluationOtherState extends State<EvaluationOther> {
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  Future<void>? _getExams(BuildContext context) {
    if (Provider.of<Exams>(context).data.isEmpty) {
      return Provider.of<Exams>(context, listen: false).fetchExams();
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<Exams>(
      builder: (context, exams, child) => FutureBuilder(
        future: _getExams(context),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (snapshot.hasError) {
            return const Center(
              child: Text('Something went wrong!'),
            );
          }
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: RefreshIndicator(
              onRefresh: () => onRefresh(context, () {
                exams.fetchExams();
              }),
              child: ExamListData(
                data: exams.tryoutsData,
                startExam: exams.startExam,
              ),
            ),
          );
        },
      ),
    );
  }
}
