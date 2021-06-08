import 'package:flutter/material.dart';
import 'package:flash/flash.dart';

class FlashMessage {

  static showCenterFlash({
    BuildContext context,
    String text
  }) {
    showFlash(
      context: context,
      duration: Duration(seconds: 2),
      builder: (_, controller) {
        return Flash(
          controller: controller,
          backgroundColor: Colors.black87,
          borderRadius: BorderRadius.circular(8.0),
          borderColor: Colors.blue,
          position: FlashPosition.bottom,
          style: FlashStyle.floating,
          enableDrag: false,
          onTap: () => controller.dismiss(),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: DefaultTextStyle(
              style: TextStyle(color: Colors.white),
              child: Text(
                  text
              ),
            ),
          ),
        );
      },
    );
  }
}