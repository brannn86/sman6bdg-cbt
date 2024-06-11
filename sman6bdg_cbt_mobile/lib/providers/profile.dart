import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ProfileData {
  int id;
  String email;
  String username;
  String name;
  String? imagePath;
  String? images;
  String? phone;
  String? address;
  String? postalCode;
  String? province;
  int? provinceId;
  String? regency;
  int? regencyId;
  String? district;
  int? districtId;
  String? classroom;
  int? classroomId;
  String? password;
  String? passwordConfirmation;

  ProfileData({
    required this.id,
    required this.email,
    required this.username,
    required this.name,
    this.imagePath,
    this.phone,
    this.address,
    this.postalCode,
    this.province,
    this.provinceId,
    this.regency,
    this.regencyId,
    this.district,
    this.districtId,
    this.classroom,
    this.classroomId,
    this.password,
    this.passwordConfirmation,
    this.images,
  });

  @override
  String toString() {
    return 'ProfileData('
        'id: $id, '
        'email: $email, '
        'username: $username, '
        'name: $name, '
        'imagePath: $imagePath, '
        'images: $images, '
        'phone: $phone, '
        'address: $address, '
        'postalCode: $postalCode, '
        'province: $province, '
        'provinceId: $provinceId, '
        'regency: $regency, '
        'regencyId: $regencyId, '
        'district: $district, '
        'districtId: $districtId, '
        'classroom: $classroom, '
        'classroomId: $classroomId, '
        'password: $password, '
        'passwordConfirmation: $passwordConfirmation'
        ')';
  }
}

class Profile with ChangeNotifier {
  String? token;
  final void Function()? _resetToken;
  ProfileData? _data;

  Profile(this.token, this._resetToken, this._data);

  ProfileData? get data {
    return _data;
  }

  void resetProfile() {
    _data = null;
    notifyListeners();
  }

  Future<void> getProfile([refresh = false]) async {
    if (token == null) return;

    final url = Uri.parse('${dotenv.env['API_URL']}/api/auth/me');

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
        resetProfile();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      _data = ProfileData(
        id: responseData['data']['user']['id'],
        email: responseData['data']['user']['email'],
        username: responseData['data']['user']['username'],
        name: responseData['data']['user']['profile']['name'],
        imagePath: responseData['data']['user']['profile']['image_path'],
        phone: responseData['data']['user']['profile']['phone'] ??
            'Nomor telepon belum diisi',
        address: responseData['data']['user']['profile']['address'],
        postalCode: responseData['data']['user']['profile']['postal_code'],
        province:
            responseData['data']['user']['profile']['province']?['name'] ?? '',
        provinceId:
            responseData['data']['user']['profile']['province']?['id'] ?? 0,
        regency:
            responseData['data']['user']['profile']['regency']?['name'] ?? '',
        regencyId:
            responseData['data']['user']['profile']['regency']?['id'] ?? 0,
        district:
            responseData['data']['user']['profile']['district']?['name'] ?? '',
        districtId:
            responseData['data']['user']['profile']['district']?['id'] ?? 0,
        classroom: responseData['data']['user']['main_class']?['name'] ??
            'Belum Masuk Kelas',
        classroomId: responseData['data']['user']['main_class']?['id'] ?? 0,
      );

      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> updateProfile(String id, ProfileData profileData) async {
    final url = Uri.parse('${dotenv.env['API_URL']}/api/users/$id');

    try {
      http.MultipartRequest request = http.MultipartRequest('POST', url);

      request.headers.addAll({
        HttpHeaders.authorizationHeader: 'Bearer $token',
      });

      Map<String, String> fields = {
        'name': profileData.name != _data?.name ? profileData.name : '',
        'username':
            profileData.username != _data?.username ? profileData.username : '',
        'email': profileData.email != _data?.email ? profileData.email : '',
        'password': profileData.password ?? '',
        'password_confirmation': profileData.passwordConfirmation ?? '',
        'address': profileData.address != _data?.address
            ? profileData.address ?? ''
            : '',
        'phone':
            profileData.phone != _data?.phone ? profileData.phone ?? '' : '',
        'district_id': profileData.districtId != _data?.districtId
            ? profileData.districtId?.toString() ?? ''
            : '',
        'province_id': profileData.provinceId != _data?.provinceId
            ? profileData.provinceId?.toString() ?? ''
            : '',
        'regency_id': profileData.regencyId != _data?.regencyId
            ? profileData.regencyId?.toString() ?? ''
            : '',
        'postal_code': profileData.postalCode != _data?.postalCode
            ? profileData.postalCode ?? ''
            : '',
      };

      fields.removeWhere((key, value) => value.isEmpty);

      request.fields.addAll(fields);

      if (profileData.images != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'images',
            profileData.images!,
          ),
        );
      }

      http.StreamedResponse response = await request.send();

      final responseData = jsonDecode(await response.stream.bytesToString());

      if (responseData['success'] == false && response.statusCode == 401) {
        _resetToken!();
        resetProfile();

        throw HttpException(responseData['message']);
      }

      if (responseData['success'] == false && response.statusCode != 200) {
        throw HttpException(responseData['message']);
      }

      _data = profileData;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }
}
