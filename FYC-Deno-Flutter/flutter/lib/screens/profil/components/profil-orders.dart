import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../models/orders-model.dart';
import '../../../services/webservice.dart';
import 'package:provider/provider.dart';
import '../../../models/user-model.dart';
import '../../../services/flash-message.dart';

class ProfilOrders extends StatelessWidget {
  final List<Order> orders;

  const ProfilOrders({Key key, this.orders}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var userJWT = Provider.of<UserModel>(context).jwt;
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(height: 10.0),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
            DataTable(
              columnSpacing: 30,
              columns: const <DataColumn>[
                DataColumn(
                  label: Text(
                    'ID',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Date',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Montant',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'Annulation',
                    style: TextStyle(fontStyle: FontStyle.italic),
                  ),
                )
              ],
              rows: <DataRow>[
                for (var element in orders)
                  DataRow(
                    cells: <DataCell>[
                      DataCell(Text(element.ID.toString())),
                      DataCell(Text(DateFormat('yyyy-MM-dd').format(element.date))),
                      DataCell(Text(element.amount.toString())),
                      DataCell(MaterialButton(
                          onPressed: () {
                            WebService.cancelOrder(userJWT, element.ID.toString()).then((response) {
                              FlashMessage.showCenterFlash(
                                  context: context, text: "Votre commande a bien été annulée");
                              Navigator.pushNamed(context, '/profile');
                            });
                          },
                          color: Colors.red,
                          child: Text("Annuler",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.bold)))),
                    ],
                  ),
              ],
            )
          ])
        ]);
  }
}
