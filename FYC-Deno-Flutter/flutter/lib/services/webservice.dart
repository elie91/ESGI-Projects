import 'package:http/http.dart' as http;
import 'dart:convert';

const baseUrl = "http://localhost:8080/";

class WebService {
  static Future getProducts() {
    var url = baseUrl + 'products';
    return http.get(url);
  }

  static Future signup(String lastname, String firstname, String email, String password) {
    var url = baseUrl + 'users';
    return http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String>{
        'lastName': lastname,
        'firstName': firstname,
        'email': email,
        'password': password
      }),
    );
  }

  static Future login(String email, String password) {
    var url = baseUrl + 'login';
    return http.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{"email": email, "password": password}));
  }

  static Future createOrder(String userJWT, List<Map> products) {
    var url = baseUrl + 'orders';
    return http.post(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userJWT
        },
        body: jsonEncode(<String, List<Map>>{"products": products}));
  }

  static Future getOrders(String userJWT) {
    var url = baseUrl + 'orders';
    return http.get(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userJWT
        });
  }

  static Future cancelOrder(String userJWT, String orderId) {
    var url = baseUrl + 'orders/' + orderId;
    return http.delete(url,
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userJWT
        });
  }
}
