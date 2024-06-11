import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../model/http_exception.dart';
import '../providers/auth.dart';

class LoginScreen extends StatefulWidget {
  static const String routeName = '/login';

  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _isLoading = false;

  Future<void> _submit() async {
    final scaffold = ScaffoldMessenger.of(context);

    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    _formKey.currentState!.save();

    try {
      await Provider.of<Auth>(context, listen: false)
          .login(_usernameController.text, _passwordController.text);
    } on HttpException catch (e) {
      scaffold.showSnackBar(
        SnackBar(
          content: Text(e.toString().split(':').last),
        ),
      );
    } catch (e) {
      scaffold.showSnackBar(
        SnackBar(
          content: Text(e.toString().split(':').last),
        ),
      );
    }
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Container(
          padding: EdgeInsets.fromLTRB(32, deviceSize.height * 0.1, 32, 16),
          width: deviceSize.width,
          height: deviceSize.height -
              MediaQuery.of(context).viewInsets.bottom -
              MediaQuery.of(context).padding.top -
              56,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Selamat Datang',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const Text('Silahkan login ke akun anda'),
              const SizedBox(height: 16),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'E-mail atau Username kosong!';
                        }
                        return null;
                      },
                      enabled: !_isLoading,
                      keyboardType: TextInputType.name,
                      textInputAction: TextInputAction.next,
                      controller: _usernameController,
                      decoration: InputDecoration(
                        hintText: 'E-mail atau Username',
                        filled: true,
                        fillColor: Theme.of(context).cardTheme.color,
                        contentPadding: const EdgeInsets.all(16),
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Password kosong!';
                        }
                        if (value.length < 8) {
                          return 'Password minimal 8 karakter!';
                        }
                        return null;
                      },
                      enabled: !_isLoading,
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: 'Password',
                        filled: true,
                        fillColor: Theme.of(context).cardTheme.color,
                        contentPadding: const EdgeInsets.all(16),
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      textInputAction: TextInputAction.go,
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading
                            ? null
                            : () {
                                _submit();
                              },
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (_isLoading)
                              const SizedBox(
                                width: 10,
                                height: 10,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            else
                              const Text('Login'),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
