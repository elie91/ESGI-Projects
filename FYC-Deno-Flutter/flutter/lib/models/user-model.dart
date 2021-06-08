import 'package:flutter/material.dart';

class UserModel extends ChangeNotifier {
  String jwt;

  UserModel({this.jwt});

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      jwt: json['jwt'],
    );
  }

  onLoginSuccess(String jwt) {
    this.jwt = jwt;
    notifyListeners();
  }

  void logout() {
    this.jwt = "";
    notifyListeners();
  }
}
