import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

import 'exam.dart';

class Exams with ChangeNotifier {
  String? token;
  List<Exam> _data = [];
  List<QuestionAnswer> _questionAnswers = [];
  final void Function()? _resetToken;

  int _setAnswerlimit = 0;

  Exams(this.token, this._data, this._resetToken);

  List<Exam> get data {
    return [..._data];
  }

  List<Exam> get tryoutsData {
    return [...data.where((exam) => exam.categoryExamId == 1)];
  }

  List<Exam> get examsData {
    return [...data.where((exam) => exam.categoryExamId == 2)];
  }

  List<QuestionAnswer> get questionAnswers {
    return [..._questionAnswers];
  }

  void resetExam() {
    _data = [];
    _questionAnswers = [];
    notifyListeners();
  }

  void _trySetAnswer(int examId, int questionId, int? answer) {
    bool foundMatch = false;
    _questionAnswers
        .where((element) => element.questionId == questionId)
        .forEach((element) {
      element.answer = answer;
      foundMatch = true;
    });

    if (!foundMatch) {
      _questionAnswers.add(
        QuestionAnswer(
          examId: examId,
          questionId: questionId,
          answer: answer,
        ),
      );
    }

    notifyListeners();
  }

  Future<void> fetchExams() async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/exams');
    try {
      final response = await http.get(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $token',
        },
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();
        resetExam();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      final extractedData =
          responseData['data']['data']['data'] as List<dynamic>;

      if (extractedData.isEmpty) return;

      final List<Exam> loadedExams = [];

      for (var examData in extractedData) {
        loadedExams.add(Exam.fromJson(examData));
      }

      _data = loadedExams;

      notifyListeners();
    } catch (error) {
      rethrow;
    }
  }

  Future<void> startExam(int id) async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/exams/$id/start-exam');

    try {
      final response = await http.post(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $token',
        },
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      final extractedData = responseData['data']['data']['student_exam_answer'];

      if (extractedData != null && extractedData.isNotEmpty) {
        final List<QuestionAnswer> loadedQuestionAnswers = [];

        for (var examData in extractedData) {
          loadedQuestionAnswers.add(QuestionAnswer.fromJson(examData));
        }

        _questionAnswers = loadedQuestionAnswers;
      }

      notifyListeners();
    } catch (error) {
      rethrow;
    }
  }

  Future<void> setAnswer(int examId, int questionId, int? answer) async {
    final url =
        Uri.parse('${dotenv.env['API_URL']}/api/exams/$examId/$questionId');

    try {
      _trySetAnswer(examId, questionId, answer);

      if (answer == null) return;

      final response = await http.post(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $token',
        },
        body: {'answer': answer.toString()},
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();
        resetExam();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }
    } catch (error) {
      if (_setAnswerlimit < 3) {
        Future.delayed(const Duration(seconds: 2),
            () => setAnswer(examId, questionId, answer));
        _setAnswerlimit++;
        return;
      }

      setAnswer(examId, questionId, null);
      _setAnswerlimit = 0;
    }
  }

  Future<void> submitExam(int id) async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/exams/$id/submit-exam');

    try {
      final response = await http.post(url, headers: {
        HttpHeaders.authorizationHeader: 'Bearer $token',
      });

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();
        resetExam();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      _questionAnswers.clear();
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> blockExam(int examId, String message) async {
    final url = Uri.parse(
      '${dotenv.env['API_URL']}/api/exams/$examId/block-exam',
    );

    try {
      final response = await http.post(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $token',
        },
        body: {
          'warning': message,
        },
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();
        resetExam();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      _questionAnswers.clear();
      notifyListeners();
    } catch (e) {
      blockExam(examId, message);
    }
  }
}
