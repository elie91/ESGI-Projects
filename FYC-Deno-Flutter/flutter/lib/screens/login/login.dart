import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import '../../services/webservice.dart';
import '../../constants.dart';
import 'components/entryField.dart';
import 'dart:convert';
import 'components/createAccountLabel.dart';
import '../../models/user-model.dart';
import 'package:provider/provider.dart';
import '../../services/flash-message.dart';

class LoginScreen extends StatefulWidget {

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  Widget _emailPasswordWidget() {
    return Column(
      children: <Widget>[
        EntryField(
          title: "Email",
          controller: emailController,
          isPassword: false,
        ),
        EntryField(
          title: "Mot de passe",
          controller: passwordController,
          isPassword: true,
        ),
      ],
    );
  }

  handleLogin() {
    WebService.login(emailController.text, passwordController.text)
        .then((response) {
      if (response.statusCode == 200) {
        var user = UserModel.fromJson(jsonDecode(response.body));
        Provider.of<UserModel>(context).onLoginSuccess(user.jwt);
        FlashMessage.showCenterFlash(context: context, text: "Connexion réussie");
        Navigator.pushNamed(context, '/');
      } else {
        FlashMessage.showCenterFlash(context: context, text: "Identifiants invalides");
      }
    });
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height;

    return Form(
        key: _formKey,
        child: Scaffold(
            appBar: AppBar(
                backgroundColor: MAIN_COLOR,
                elevation: 0,
                leading: IconButton(
                  icon: SvgPicture.asset(
                    'assets/icons/back.svg',
                    color: Colors.white,
                  ),
                  onPressed: () => Navigator.pop(context),
                )),
            body: Container(
              height: height,
              child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: SingleChildScrollView(
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            SizedBox(height: height * .1),
                            Text(
                              "ShopOnline",
                              style: Theme.of(context).textTheme.headline4,
                            ),
                            SizedBox(height: 50),
                            _emailPasswordWidget(),
                            SizedBox(height: 20),
                            RaisedButton(
                                padding: EdgeInsets.all(0),
                                onPressed: () {
                                  if (_formKey.currentState.validate()) {
                                    handleLogin();
                                  }
                                },
                                child: Container(
                                  width: MediaQuery.of(context).size.width,
                                  padding: EdgeInsets.symmetric(vertical: 15),
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    borderRadius:
                                    BorderRadius.all(Radius.circular(5)),
                                    boxShadow: <BoxShadow>[
                                      BoxShadow(
                                          color: Colors.grey.shade200,
                                          offset: Offset(2, 4),
                                          blurRadius: 5,
                                          spreadRadius: 2)
                                    ],
                                    color: MAIN_COLOR,
                                  ),
                                  child: Text(
                                    'Connexion',
                                    style: TextStyle(
                                        fontSize: 20, color: Colors.white),
                                  ),
                                )),
                            SizedBox(height: height * .055),
                            CreateAccountLabel()
                          ]))),
            )));
  }
}
