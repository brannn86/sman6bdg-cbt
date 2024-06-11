import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../providers/profile.dart';
import '../providers/region.dart';
import '../utils/show_loading_dialog.dart';
import '../widgets/appbar_leading.dart';
import '../widgets/profile_edit_avatar.dart';

class ProfileEditScreen extends StatefulWidget {
  static const String rounteName = '/profile-edit';

  const ProfileEditScreen({super.key});

  @override
  State<ProfileEditScreen> createState() => _ProfileEditScreenState();
}

class _ProfileEditScreenState extends State<ProfileEditScreen> {
  final _formKey = GlobalKey<FormState>();
  File? _image;
  ProfileData? _profileData;
  String? _password;

  ProfileData? _newProfileData;

  final _usernameRegEx =
      RegExp(r'^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$');
  final _emailRegEx = RegExp(
      r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$");

  @override
  void initState() {
    super.initState();
    Provider.of<Regions>(context, listen: false).getProvinces();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    Regions regions = Provider.of<Regions>(context, listen: false);

    _profileData = Provider.of<Profile>(context).data;
    _newProfileData = ProfileData(
      id: _profileData!.id,
      email: _profileData!.email,
      username: _profileData!.username,
      name: _profileData!.name,
      phone: _profileData!.phone,
      address: _profileData!.address,
      postalCode: _profileData!.postalCode,
      province: _profileData!.province,
      provinceId: _profileData!.provinceId,
      regency: _profileData!.regency,
      regencyId: _profileData!.regencyId,
      district: _profileData!.district,
      districtId: _profileData!.districtId,
      classroom: _profileData!.classroom,
      classroomId: _profileData!.classroomId,
      images: _profileData!.images,
      imagePath: _profileData!.imagePath,
    );

    if (_newProfileData?.provinceId != null) {
      regions.getRegencies(_newProfileData!.provinceId.toString());
    }
    if (_newProfileData?.regencyId != null) {
      regions.getDistricts(_newProfileData!.regencyId.toString());
    }
  }

  Future<void> _getImage(ImageSource imageSource) async {
    final ImagePicker picker = ImagePicker();
    final XFile? pickedImage = await picker.pickImage(source: imageSource);

    setState(() {
      _image = File(pickedImage!.path);
      _newProfileData!.images = _image!.path;
    });
  }

  Future<void> _submit() async {
    final isValid = _formKey.currentState!.validate();

    if (!isValid) return;

    _formKey.currentState!.save();

    showLoadingDialog(context, 'Menyimpan data...');

    try {
      await Provider.of<Profile>(context, listen: false)
          .updateProfile(_newProfileData!.id.toString(), _newProfileData!);

      if (context.mounted) {
        Navigator.popUntil(
          context,
          (route) => route.settings.name == '/',
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString().split(': ')[1]),
        ),
      );
      if (context.mounted) Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scaffold = ScaffoldMessenger.of(context);

    return Scaffold(
      appBar: AppBar(
        leading: const AppBarLeading(),
        title: const Text('Edit Profil'),
        actions: [
          TextButton(
            onPressed: () {
              _submit();
            },
            child: const Text(
              'Simpan',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Form(
            key: _formKey,
            child: Consumer<Regions>(
              builder: (context, regions, child) => Column(
                children: [
                  const SizedBox(height: 32),
                  ProfileEditAvatar(
                    _newProfileData!.imagePath,
                    _image,
                    _getImage,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Nama kosong!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.name = value!;
                    },
                    initialValue: _newProfileData!.name,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'Nama',
                      hintText: 'cth: Vestia Zeta',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Username kosong!';
                      } else if (value.length < 6) {
                        return 'Username minimal 6 karakter!';
                      } else if (!_usernameRegEx.hasMatch(value)) {
                        return 'Username tidak valid!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.username = value!;
                    },
                    initialValue: _newProfileData!.username,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'Username',
                      hintText: 'cth: vestiazeta',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'E-mail kosong!';
                      } else if (!_emailRegEx.hasMatch(value)) {
                        return 'E-mail tidak valid!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.email = value!;
                    },
                    initialValue: _newProfileData!.email,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'E-mail',
                      hintText: 'cth: vestiazeta@gmail.com',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'No. Telepon kosong!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.phone = value!;
                    },
                    initialValue: _newProfileData!.phone,
                    keyboardType: TextInputType.phone,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'No. Telepon',
                      hintText: 'cth: 081234567890',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField(
                    value: _newProfileData!.provinceId,
                    items: regions.provinces!.map((province) {
                      return DropdownMenuItem(
                        value: province.id,
                        child: Text(province.name),
                      );
                    }).toList(),
                    onChanged: (provinceId) async {
                      setState(() {
                        _newProfileData!.provinceId = provinceId!;
                        _newProfileData!.province = regions.provinces!
                            .firstWhere((province) => province.id == provinceId)
                            .name;

                        _newProfileData!.regency = null;
                        _newProfileData!.regencyId = null;

                        _newProfileData!.district = null;
                        _newProfileData!.districtId = null;
                      });

                      try {
                        await regions.getRegencies(provinceId.toString());
                        await regions.getDistricts(
                            _newProfileData?.regencyId.toString());
                      } catch (e) {
                        scaffold.showSnackBar(
                          const SnackBar(
                            content: Text('Gagal mengambil data'),
                          ),
                        );
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'Provinsi',
                      hintText: 'Provinsi kosong!',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField(
                    value: _newProfileData!.regencyId,
                    items: regions.regencies!.map((regency) {
                      return DropdownMenuItem(
                        value: regency.id,
                        child: Text(regency.name),
                      );
                    }).toList(),
                    onChanged: (regencyId) async {
                      setState(() {
                        _newProfileData!.regencyId = regencyId!;
                        _newProfileData!.regency = regions.regencies!
                            .firstWhere((regency) => regency.id == regencyId)
                            .name;
                        _newProfileData!.district = null;
                        _newProfileData!.districtId = null;
                      });

                      try {
                        await regions.getDistricts(regencyId.toString());
                      } catch (e) {
                        scaffold.showSnackBar(
                          const SnackBar(
                            content: Text('Gagal mengambil data'),
                          ),
                        );
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'Kabupaten/Kota',
                      hintText: 'Kabupaten/Kota kosong!',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField(
                    value: _newProfileData!.districtId,
                    items: regions.districts!.map((district) {
                      return DropdownMenuItem(
                        value: district.id,
                        child: Text(district.name),
                      );
                    }).toList(),
                    onChanged: (districtId) {
                      setState(() {
                        _newProfileData!.districtId = districtId!;
                        _newProfileData!.district = regions.districts!
                            .firstWhere((district) => district.id == districtId)
                            .name;
                      });
                    },
                    decoration: InputDecoration(
                      labelText: 'Kecamatan',
                      hintText: 'Kecamatan kosong!',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Alamat Lengkap kosong!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.address = value!;
                    },
                    initialValue: _newProfileData!.address,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'Alamat Lengkap',
                      hintText: 'cth: Jl. Raya No. 1 Desa Liyue',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Kode Pos kosong!';
                      }
                      return null;
                    },
                    onSaved: (value) {
                      _newProfileData!.postalCode = value!;
                    },
                    initialValue: _newProfileData!.postalCode,
                    keyboardType: TextInputType.number,
                    textInputAction: TextInputAction.next,
                    decoration: InputDecoration(
                      labelText: 'Kode Pos',
                      hintText: 'cth: 56364',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (value != null &&
                          value.isNotEmpty &&
                          value.length < 8) {
                        return 'Password minimal 8 karakter!';
                      }
                      return null;
                    },
                    onChanged: (value) => setState(() {
                      _password = value;
                    }),
                    onSaved: (newValue) {
                      _newProfileData!.password = newValue!;
                    },
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: '・・・・・・・・',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    validator: (value) {
                      if (_password != null &&
                          _password!.isNotEmpty &&
                          (value == null || value.isEmpty)) {
                        return 'Konfirmasi password kosong!';
                      } else if (_password != null &&
                          _password!.isNotEmpty &&
                          value!.length < 8) {
                        return 'Konfirmasi password minimal 8 karakter!';
                      } else if (_password != null &&
                          _password!.isNotEmpty &&
                          value != _password) {
                        return 'Konfirmasi password tidak sama!';
                      }
                      return null;
                    },
                    onSaved: (newValue) {
                      _newProfileData!.passwordConfirmation = newValue!;
                    },
                    enabled: _password != null && _password!.isNotEmpty,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Konfirmasi Password',
                      hintText: '・・・・・・・・',
                      filled: true,
                      fillColor: Theme.of(context).cardTheme.color,
                      contentPadding: const EdgeInsets.all(16),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
