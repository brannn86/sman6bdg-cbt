import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Auth with ChangeNotifier {
  String? _token;

  bool get isAuth {
    return token != null;
  }

  String? get token {
    if (_token != null) {
      return _token;
    }
    return null;
  }

  Future<void> _authenticate(String username, String password) async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/auth/login/student');

    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();

      final response = await http.post(
        url,
        body: {
          'username': username,
          'password': password,
        },
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      _token = responseData['data']['token'];

      final userData = jsonEncode({
        'token': _token,
      });

      prefs.setString('userData', userData);

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<bool> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();

    if (!prefs.containsKey('userData')) return false;

    final userData =
        jsonDecode(prefs.getString('userData')!) as Map<String, dynamic>;

    _token = userData['token'];

    if (token == null) return false;

    notifyListeners();

    return true;
  }

  Future<void> login(String username, String password) async {
    return _authenticate(username, password);
  }

  void logout() async {
    final prefs = await SharedPreferences.getInstance();

    _token = null;

    prefs.remove('userData');

    notifyListeners();
  }

  void resetToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    _token = null;
    final userData = jsonEncode({
      'token': _token,
    });

    prefs.setString('userData', userData);

    notifyListeners();
  }
}
