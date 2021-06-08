import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import '../../constants.dart';
import '../login/components/entryField.dart';
import '../../services/webservice.dart';
import '../../services/flash-message.dart';

class SignUpScreen extends StatefulWidget {
  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final lastNameController = TextEditingController();
  final firstNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    lastNameController.dispose();
    firstNameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget _inputsWidget() {
    return Column(
      children: <Widget>[
        EntryField(
          title: "Nom",
          controller: lastNameController,
          isPassword: false,
        ),
        EntryField(
          title: "Prénom",
          controller: firstNameController,
          isPassword: false,
        ),
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

  Widget _submitButton() {
    return RaisedButton(
        padding: EdgeInsets.all(0),
        onPressed: () {
          if (_formKey.currentState.validate()) {
            WebService.signup(lastNameController.text, firstNameController.text,
                emailController.text, passwordController.text)
                .then((response) {
              if (response.statusCode == 201) {
                FlashMessage.showCenterFlash(
                    context: context, text: "Inscription réussie");
                Navigator.pushNamed(context, '/login');
              } else {
                FlashMessage.showCenterFlash(
                    context: context, text: response.body.toString());
              }
            });
          }
        },
        child: Container(
          width: MediaQuery.of(context).size.width,
          padding: EdgeInsets.symmetric(vertical: 15),
          alignment: Alignment.center,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.all(Radius.circular(5)),
              boxShadow: <BoxShadow>[
                BoxShadow(
                    color: Colors.grey.shade200,
                    offset: Offset(2, 4),
                    blurRadius: 5,
                    spreadRadius: 2)
              ],
              color: MAIN_COLOR),
          child: Text(
            'Inscription',
            style: TextStyle(fontSize: 20, color: Colors.white),
          ),
        ));
  }

  Widget _loginAccountLabel() {
    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, '/login');
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 20),
        padding: EdgeInsets.all(15),
        alignment: Alignment.bottomCenter,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Vous avez déja un compte ?',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
            SizedBox(
              width: 10,
            ),
            Text(
              'Connexion',
              style: TextStyle(color: MAIN_COLOR, fontSize: 13, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
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
            child: Stack(
              children: <Widget>[
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        SizedBox(height: 20),
                        Text(
                          "Inscription ShopOnline",
                          style: Theme.of(context).textTheme.headline4,
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        _inputsWidget(),
                        SizedBox(
                          height: 20,
                        ),
                        _submitButton(),
                        SizedBox(height: 20),
                        _loginAccountLabel(),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
