import 'dart:async';
import 'dart:developer' as developer;
import 'dart:io';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_windowmanager/flutter_windowmanager.dart';
import 'package:keep_screen_on/keep_screen_on.dart';
import 'package:provider/provider.dart';
import 'package:quiver/async.dart';

import '../model/exams_args.dart';
import '../providers/exam.dart';
import '../providers/exams.dart';
import '../utils/show_confirmation.dart';
import '../widgets/exam_profile.dart';
import '../widgets/exam_qa.dart';
import '../widgets/exam_question_list.dart';

class ExamScreen extends StatefulWidget {
  static const String routeName = '/exam-screen';

  const ExamScreen({super.key});

  @override
  State<ExamScreen> createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen> with WidgetsBindingObserver {
  late String _title;
  List<Question>? _questions;

  int _currentQuestion = 0;
  int _start = 0;
  String _current = '00:00';

  bool _isAppActive = true;
  Timer? _appTimer;

  late StreamSubscription<CountdownTimer> _timerSub;

  ConnectivityResult _connectionStatus = ConnectivityResult.none;
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;

  void _startTimer() {
    CountdownTimer countDownTimer = CountdownTimer(
      Duration(seconds: _start),
      const Duration(seconds: 1),
    );

    _timerSub = countDownTimer.listen(null);
    _timerSub.onData((duration) {
      if (mounted) {
        setState(() {
          _current = Duration(seconds: duration.remaining.inSeconds)
              .toString()
              .split('.')
              .first;
        });
      }
    });

    _timerSub.onDone(() {
      _timerSub.cancel();

      if (_isAppActive) {
        _submitExam();
      }
    });
  }

  void _setQuestion(int index) {
    setState(() {
      _currentQuestion = index;
    });
  }

  Future<void> _submitExam() async {
    final Exams exams = Provider.of<Exams>(context, listen: false);

    try {
      showModalBottomSheet(
        isDismissible: false,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(16),
          ),
        ),
        context: context,
        builder: (context) => Container(
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
      );

      await exams.submitExam(_questions!.first.pivot.examId);

      exams.resetExam();

      if (context.mounted) {
        Navigator.pop(context);
        Navigator.popUntil(context, (route) => route.settings.name == '/');
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
              e.toString(),
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
        ),
      );
    }
  }

  Future<void> _blockExam() async {
    final Exams exams = Provider.of<Exams>(context, listen: false);

    await exams.blockExam(
      _questions!.first.pivot.examId,
      'Keluar dari aplikasi',
    );

    exams.resetExam();

    if (context.mounted) {
      Navigator.popUntil(context, (route) => route.settings.name == '/');
    }
  }

  void _startAppTimer() {
    const inactiveDuration = Duration(seconds: 5);
    _appTimer = Timer(inactiveDuration, () {
      if (!_isAppActive) {
        _blockExam();
      }
    });
  }

  void _cancelAppTimer() {
    _appTimer?.cancel();
    _appTimer = null;
  }

  Future<void> initConnectivity() async {
    late ConnectivityResult result;

    try {
      result = await _connectivity.checkConnectivity();
    } on PlatformException catch (e) {
      developer.log('Couldn\'t check connectivity status', error: e);
      return;
    }

    if (!mounted) {
      return Future.value(null);
    }

    return _updateConnectionStatus(result);
  }

  Future<void> _updateConnectionStatus(ConnectivityResult result) async {
    setState(() {
      _connectionStatus = result;
    });
  }

  Future<void> _addFlags() async {
    if (!Platform.isAndroid) return;
    await FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE);
  }

  Future<void> _clearFlags() async {
    if (!Platform.isAndroid) return;
    await FlutterWindowManager.clearFlags(FlutterWindowManager.FLAG_SECURE);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    KeepScreenOn.turnOn();
    _addFlags();
    initConnectivity();

    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final ExamsArgs args =
        ModalRoute.of(context)!.settings.arguments as ExamsArgs;

    _title = args.title;
    _questions = args.questions;

    _start = DateTime.parse(args.endAt)
        .toLocal()
        .difference(DateTime.now())
        .inSeconds;

    _questions?.shuffle();
    _startTimer();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.inactive) {
      _isAppActive = false;
      _startAppTimer();
    } else if (state == AppLifecycleState.resumed) {
      _cancelAppTimer();
      _isAppActive = true;
    }
  }

  @override
  void dispose() {
    _timerSub.cancel();
    WidgetsBinding.instance.removeObserver(this);
    KeepScreenOn.turnOff();
    _clearFlags();
    _connectivitySubscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async => false,
      child: Scaffold(
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text(_title),
          actions: [
            if (_connectionStatus == ConnectivityResult.none)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Icon(
                  Icons.signal_cellular_off,
                  color: Theme.of(context).colorScheme.error,
                ),
              )
            else if (_connectionStatus == ConnectivityResult.wifi)
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Icon(Icons.wifi),
              )
            else
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Icon(Icons.signal_cellular_4_bar),
              ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ListView(
                  physics: const BouncingScrollPhysics(),
                  children: [
                    const SizedBox(height: 16),
                    const ExamProfile(),
                    const SizedBox(height: 16),
                    ExamQA(
                      number: _currentQuestion,
                      data: _questions![_currentQuestion],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        TextButton(
                          onPressed: _currentQuestion > 0
                              ? () => setState(() {
                                    _currentQuestion--;
                                  })
                              : null,
                          child: const Text(
                            'Sebelumnya',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        TextButton(
                          onPressed: _currentQuestion < _questions!.length - 1
                              ? () => setState(() {
                                    _currentQuestion++;
                                  })
                              : null,
                          child: const Text(
                            'Selanjutnya',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, 2), // changes position of shadow
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: Theme.of(context).canvasColor,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: IconButton(
                      onPressed: () => showModalBottomSheet(
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.vertical(
                            top: Radius.circular(16),
                          ),
                        ),
                        context: context,
                        builder: (context) {
                          return ExamQuestionList(
                            _questions,
                            _currentQuestion,
                            _setQuestion,
                          );
                        },
                      ),
                      icon: const Icon(Icons.assignment),
                    ),
                  ),
                  Row(
                    children: [
                      const Icon(Icons.timer_outlined),
                      const SizedBox(width: 8),
                      Text(_current.toString()),
                    ],
                  ),
                  ElevatedButton(
                    onPressed: () => showConfirmation(
                      context,
                      'Apakah anda yakin?',
                      'Pastikan semua jawaban terisi!',
                      'Selesai',
                      'Batal',
                      _submitExam,
                    ),
                    style:
                        Theme.of(context).elevatedButtonTheme.style!.copyWith(
                              backgroundColor: MaterialStateProperty.all(
                                Theme.of(context).colorScheme.secondary,
                              ),
                            ),
                    child: const Text('Selesai'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
