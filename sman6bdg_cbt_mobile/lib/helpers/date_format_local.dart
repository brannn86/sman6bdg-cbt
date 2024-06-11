import 'package:intl/intl.dart';

String dateFormatLocal(String date) {
  return DateFormat('dd LLL yyyy HH:mm ', 'id_ID').format(
    DateTime.parse(date).toLocal(),
  );
}
