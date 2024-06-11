import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/exam.dart';
import '../providers/exams.dart';

class ExamQuestionList extends StatelessWidget {
  final List<Question>? _questions;
  final int _currentQuestion;
  final Function(int) _onTap;

  const ExamQuestionList(this._questions, this._currentQuestion, this._onTap,
      {super.key});

  @override
  Widget build(BuildContext context) {
    QuestionAnswer data;

    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.5,
      child: Column(
        children: [
          const SizedBox(height: 16),
          const Text('Daftar Soal'),
          const SizedBox(height: 16),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: GridView.builder(
                physics: const BouncingScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 48,
                  childAspectRatio: 1,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                shrinkWrap: true,
                itemCount: _questions?.length,
                itemBuilder: (context, index) {
                  data = Provider.of<Exams>(context).questionAnswers.firstWhere(
                        (element) =>
                            element.questionId == _questions?[index].id,
                        orElse: () => QuestionAnswer(),
                      );

                  return GestureDetector(
                    onTap: () {
                      _onTap(index);
                      Navigator.pop(context);
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: index == _currentQuestion
                            ? Theme.of(context).colorScheme.primary
                            : data.questionId == _questions?[index].id
                                ? Theme.of(context).colorScheme.secondary
                                : Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          (index + 1).toString(),
                          style: TextStyle(
                            color: index == _currentQuestion ||
                                    data.questionId == _questions?[index].id
                                ? Colors.white
                                : Colors.black,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
