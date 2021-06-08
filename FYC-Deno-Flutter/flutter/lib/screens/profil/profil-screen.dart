import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'dart:convert';
import '../../models/orders-model.dart';
import '../../models/user-model.dart';
import './components/profil-orders.dart';
import '../../services/webservice.dart';
import '../navbar.dart';
import '../../constants.dart';

class ProfilScreen extends StatefulWidget {
  @override
  createState() => _ProfilScreenState();
}

class _ProfilScreenState extends State<ProfilScreen> {
  List<Order> orders = [];

  initState() {
    super.initState();
    //technique pour utiliser le contexte dans un initState
    SchedulerBinding.instance.addPostFrameCallback((_) {
      var userJWT = Provider.of<UserModel>(context).jwt;
      WebService.getOrders(userJWT).then((response) {
        Iterable list = json.decode(response.body);
        setState(() {
          orders = list.map((model) => Order.fromJson(model)).toList();
        });
      });
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: buildAppBar(context, MAIN_COLOR, Colors.white, true),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    "Mes commandes",
                    style:
                    TextStyle(fontWeight: FontWeight.bold, fontSize: 24.0),
                  ),
                  SizedBox(height: 18.0),
                  ProfilOrders(orders: orders)
                ])));
  }
}
