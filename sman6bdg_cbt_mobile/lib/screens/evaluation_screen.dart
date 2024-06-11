import 'package:flutter/material.dart';

import 'evaluation_main.dart';
import 'evaluation_other.dart';

class Evaluation extends StatefulWidget {
  static const String routeName = '/evaluation';

  const Evaluation({super.key});

  @override
  State<Evaluation> createState() => _EvaluationState();
}

class _EvaluationState extends State<Evaluation>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: TabBar(
                    unselectedLabelColor: Colors.black,
                    labelColor: Colors.white,
                    indicatorColor: Colors.white,
                    indicatorWeight: 2,
                    indicator: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    controller: _tabController,
                    tabs: const [
                      Tab(
                        text: 'Evaluasi',
                      ),
                      Tab(
                        text: 'Lainnya',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: const [
                Center(
                  child: EvaluationMain(),
                ),
                Center(
                  child: EvaluationOther(),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
