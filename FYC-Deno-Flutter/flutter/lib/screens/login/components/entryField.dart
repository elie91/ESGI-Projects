import 'package:flutter/material.dart';


class EntryField extends StatelessWidget {

  final String title;
  final TextEditingController controller;
  final bool isPassword;

  const EntryField({
    Key key,
    this.title,
    this.controller,
    this.isPassword
  }) : super(key: key);


  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
          ),
          SizedBox(
            height: 10,
          ),
          TextFormField(
            controller: controller,
            obscureText: isPassword,
            decoration: InputDecoration(
                border: InputBorder.none,
                fillColor: Color(0xfff3f3f4),
                filled: true),
            validator: (value) {
              if (value.isEmpty) {
                return 'Veuillez saisir une valeur';
              }
              return null;
            },
          )
        ],
      ),
    );
  }
}