import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class Region {
  int id;
  String name;

  Region({
    required this.id,
    required this.name,
  });
}

class Regions with ChangeNotifier {
  final String? _token;
  final void Function()? _resetToken;

  Regions(this._token, this._resetToken);

  List<Region>? _provinces = [];
  List<Region>? _regencies = [];
  List<Region>? _districts = [];

  List<Region>? get provinces {
    return [..._provinces!];
  }

  List<Region>? get regencies {
    return [..._regencies!];
  }

  List<Region>? get districts {
    return [..._districts!];
  }

  Future<void> getProvinces() async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/regional/provinces');

    if (_token == null) return;

    try {
      final response = await http.get(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $_token',
        },
      );

      final responseData = jsonDecode(response.body);

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();

        throw HttpException(responseData['message']);
      }

      final List<Region> loadedProvinces = [];

      responseData['data']['provinces'].forEach((province) {
        loadedProvinces.add(
          Region(
            id: province['id'],
            name: province['name'],
          ),
        );
      });

      _provinces = loadedProvinces;

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> getRegencies(String? id) async {
    final url =
        Uri.parse('${dotenv.env['API_URL']}/api/regional/regencies/$id');

    if (_token == null) return;

    if (id == null) {
      _districts = [];
      notifyListeners();
      return;
    }

    try {
      final response = await http.get(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $_token',
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

      final List<Region> loadedRegencies = [];

      responseData['data']['regencies'].forEach((regency) {
        loadedRegencies.add(
          Region(
            id: regency['id'],
            name: regency['name'],
          ),
        );
      });

      _regencies = loadedRegencies;

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> getDistricts(String? id) async {
    final url =
        Uri.parse('${dotenv.env['API_URL']}/api/regional/districts/$id');

    if (_token == null) return;

    if (id == null) {
      _districts = [];
      notifyListeners();
      return;
    }

    try {
      final response = await http.get(
        url,
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer $_token',
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

      final List<Region> loadedDistricts = [];

      responseData['data']['districts'].forEach((regency) {
        loadedDistricts.add(
          Region(
            id: regency['id'],
            name: regency['name'],
          ),
        );
      });

      _districts = loadedDistricts;

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
}
