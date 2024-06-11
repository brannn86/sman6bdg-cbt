import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/exam.dart';
import '../providers/exams.dart';

class ExamQA extends StatefulWidget {
  final int number;
  final Question data;

  const ExamQA({
    super.key,
    required this.data,
    required this.number,
  });

  @override
  State<ExamQA> createState() => _ExamQAState();
}

class _ExamQAState extends State<ExamQA> {
  List<QuestionAnswer>? _questionAnswers;

  int? _getAnswers(int id) {
    if (_questionAnswers == null || _questionAnswers!.isEmpty) return null;

    return _questionAnswers
        ?.firstWhere(
          (element) => element.questionId == id,
          orElse: () => QuestionAnswer(),
        )
        .answer;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _questionAnswers = Provider.of<Exams>(context).questionAnswers;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Soal No. ${widget.number + 1}',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          if (widget.data.images != null && widget.data.images!.isNotEmpty)
            ...widget.data.imageUrl!.map(
              (image) => Column(
                children: [
                  Image.network(
                    image,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        const SizedBox(
                      height: 200,
                      child: Center(
                        child: Text('Gambar tidak ditemukan'),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          Text(
            widget.data.question,
            style: const TextStyle(
              fontSize: 18,
            ),
          ),
          ...widget.data.options.asMap().entries.map((option) {
            return RadioListTile<int>(
              title: Text(
                option.value,
                style: const TextStyle(fontSize: 16),
              ),
              value: option.key,
              groupValue: _getAnswers(widget.data.id),
              onChanged: (value) async {
                if (value == null) return;

                try {
                  await Provider.of<Exams>(context, listen: false).setAnswer(
                    widget.data.pivot.examId,
                    widget.data.id,
                    value,
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(e.toString()),
                    ),
                  );
                }
              },
            );
          }).toList()
        ],
      ),
    );
  }
}
