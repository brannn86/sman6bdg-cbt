import '../providers/exam.dart';

class ExamsArgs {
  final int id;
  final String title;
  final List<Question>? questions;
  final String endAt;

  const ExamsArgs({
    required this.id,
    required this.title,
    required this.questions,
    required this.endAt,
  });
}
