class Exam {
  final int id;
  final int subjectId;
  final int categoryExamId;
  final String name;
  final String startAt;
  final String endAt;
  final int duration;
  final String createdAt;
  final String updatedAt;
  final Status status;
  final Subject subject;
  final List<Question> questions;

  Exam({
    required this.id,
    required this.subjectId,
    required this.categoryExamId,
    required this.name,
    required this.startAt,
    required this.endAt,
    required this.duration,
    required this.createdAt,
    required this.updatedAt,
    required this.status,
    required this.subject,
    required this.questions,
  });

  factory Exam.fromJson(Map<String, dynamic> json) {
    return Exam(
      id: json['id'],
      subjectId: json['subject_id'],
      categoryExamId: json['category_exam_id'],
      name: json['name'],
      startAt: json['start_at'],
      endAt: json['end_at'],
      duration: json['duration'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      status: Status.fromJson(json['status']),
      subject: Subject.fromJson(json['subject']),
      questions: List<Question>.from(
          json['questions'].map((x) => Question.fromJson(x))),
    );
  }
}

class Subject {
  final int id;
  final int teacherId;
  final String name;
  final String createdAt;
  final String updatedAt;

  Subject({
    required this.id,
    required this.teacherId,
    required this.name,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Subject.fromJson(Map<String, dynamic> json) {
    return Subject(
      id: json['id'],
      teacherId: json['teacher_id'],
      name: json['name'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
    );
  }
}

class Question {
  final int id;
  final int subjectId;
  final List<String>? images;
  final String question;
  final List<String> options;
  final List<String>? imageUrl;
  final Pivot pivot;

  Question({
    required this.id,
    required this.subjectId,
    required this.images,
    required this.question,
    required this.options,
    required this.imageUrl,
    required this.pivot,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'],
      subjectId: json['subject_id'],
      images: json['images'] != null ? [...json['images']] : null,
      question: json['question'],
      options: [...json['options']],
      imageUrl: json['image_url'] != null ? [...json['image_url']] : null,
      pivot: Pivot.fromJson(json['pivot']),
    );
  }
}

class Pivot {
  final int examId;
  final int questionId;

  Pivot({required this.examId, required this.questionId});

  factory Pivot.fromJson(Map<String, dynamic> json) {
    return Pivot(
      examId: json['exam_id'],
      questionId: json['question_id'],
    );
  }
}

enum Status {
  upcoming,
  ongoing,
  finished;

  static Status fromJson(String json) => values.byName(json);
}

class QuestionAnswer {
  final int? examId;
  final int? questionId;
  int? answer;

  QuestionAnswer({
    this.examId,
    this.questionId,
    this.answer,
  });

  factory QuestionAnswer.fromJson(Map<String, dynamic> json) {
    return QuestionAnswer(
      examId: int.parse(json['student_exam_id']),
      questionId: int.parse(json['question_id']),
      answer: int.parse(json['answer']),
    );
  }
}
